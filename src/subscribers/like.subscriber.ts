import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Like } from '../entities/like.entity';
import { Post } from '../entities/post.entity';
import { AppDataSource } from '../config/orm.config';

@EventSubscriber()
export class LikeSubscriber implements EntitySubscriberInterface<Like> {
  listenTo() {
    return Like;
  }

  async afterInsert(event: InsertEvent<Like>) {
    if (event.entity?.post) {
      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.findOneBy({ id: event.entity.post.id });

      if (post) {
        switch (event.entity.type) {
          case 'like':
            post.likes += 1;
            break;
          case 'dislike':
            post.dislikes += 1;
            break;
        }
        await postRepository.save(post);
      }
    }
  }

  async afterUpdate(event: UpdateEvent<Like>) {
    if (event.entity?.post && event.databaseEntity) {
      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.findOneBy({ id: event.entity.post.id });

      if (post) {
        const oldType = event.databaseEntity.type;
        const newType = event.entity.type;

        if (oldType !== newType) {
          switch (oldType) {
            case 'like':
              post.likes -= 1;
              break;
            case 'dislike':
              post.dislikes -= 1;
              break;
          }
          switch (newType) {
            case 'like':
              post.likes += 1;
              break;
            case 'dislike':
              post.dislikes += 1;
              break;
          }
          await postRepository.save(post);
        }
      }
    }
  }

  async afterRemove(event: RemoveEvent<Like>) {
    if (event.entity?.post) {
      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.findOneBy({ id: event.entity.post.id });

      if (post) {
        switch (event.entity.type) {
          case 'like':
            post.likes -= 1;
            break;
          case 'dislike':
            post.dislikes -= 1;
            break;
        }
        await postRepository.save(post);
      }
    }
  }
}