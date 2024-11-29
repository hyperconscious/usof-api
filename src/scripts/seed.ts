import { AppDataSource } from '../config/orm.config';
import { User, UserRole } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Post, PostStatus } from '../entities/post.entity';
import { Comment, CommentStatus } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';
import { Favorite } from '../entities/favoutite.entity';
import bcrypt from 'bcryptjs';

const seed = async () => {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const categoryRepository = AppDataSource.getRepository(Category);
  const postRepository = AppDataSource.getRepository(Post);
  const commentRepository = AppDataSource.getRepository(Comment);
  const likeRepository = AppDataSource.getRepository(Like);
  const favoriteRepository = AppDataSource.getRepository(Favorite);

  const user1 = new User();
  user1.login = 'john_doe';
  user1.password = bcrypt.hashSync('password1', 7);
  user1.full_name = 'John Doe';
  user1.email = 'john@example.com';
  user1.role = UserRole.User;
  user1.hashPassword();

  const user2 = new User();
  user2.login = 'admin_user';
  user2.password = bcrypt.hashSync('admin123', 7);
  user2.full_name = 'Admin User';
  user2.email = 'admin@example.com';
  user2.role = UserRole.Admin;
  user2.hashPassword();

  const user3 = new User();
  user3.login = 'mike_smith';
  user3.password = bcrypt.hashSync('mike123', 7);
  user3.full_name = 'Mike Smith';
  user3.email = 'mike@example.com';
  user3.role = UserRole.User;
  user3.hashPassword();

  const user4 = new User();
  user4.login = 'lucy_jones';
  user4.password = bcrypt.hashSync('lucy123', 7);
  user4.full_name = 'Lucy Jones';
  user4.email = 'lucy@example.com';
  user4.role = UserRole.User;
  user4.hashPassword();

  await userRepository.save([user1, user2, user3, user4]);

  const category1 = new Category();
  category1.title = 'Technology';
  category1.description = 'Posts related to technology';

  const category2 = new Category();
  category2.title = 'Lifestyle';
  category2.description = 'Lifestyle posts';

  const category3 = new Category();
  category3.title = 'Health';
  category3.description = 'Health-related content';

  const category4 = new Category();
  category4.title = 'Business';
  category4.description = 'Posts related to business and entrepreneurship';

  const category5 = new Category();
  category5.title = 'Education';
  category5.description = 'Content related to education and learning';

  await categoryRepository.save([
    category1,
    category2,
    category3,
    category4,
    category5,
  ]);

  const categories = [
    {
      title: 'JavaScript',
      description:
        'For questions about programming in ECMAScript and its implementations.',
    },
    {
      title: 'Python',
      description:
        'Python is a dynamically typed, multi-purpose programming language.',
    },
    {
      title: 'Java',
      description: 'Java is a high-level object-oriented programming language.',
    },
    {
      title: 'C#',
      description:
        'C# is a high-level, statically typed, multi-paradigm programming language.',
    },
    {
      title: 'PHP',
      description:
        'PHP is a server-side scripting language designed for web development.',
    },
    {
      title: 'Android',
      description:
        "Android is Google's mobile operating system used for digital devices.",
    },
    {
      title: 'HTML',
      description:
        'HTML is the markup language for creating web pages and content.',
    },
    {
      title: 'jQuery',
      description:
        'jQuery is a cross-browser JavaScript library for DOM manipulation.',
    },
    {
      title: 'C++',
      description:
        'C++ is a general-purpose programming language for software development.',
    },
    {
      title: 'CSS',
      description:
        'CSS is a style sheet language used for describing the look of a webpage.',
    },
    {
      title: 'SQL',
      description:
        'SQL is a language for querying and managing relational databases.',
    },
    {
      title: 'React',
      description:
        'React is a JavaScript library for building user interfaces.',
    },
    {
      title: 'Node.js',
      description:
        'Node.js is a runtime for executing JavaScript code server-side.',
    },
    {
      title: 'TypeScript',
      description:
        'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
    },
    {
      title: 'Angular',
      description:
        'Angular is a platform for building mobile and desktop web applications.',
    },
    {
      title: 'Vue.js',
      description:
        'Vue.js is a progressive JavaScript framework for building user interfaces.',
    },
    {
      title: 'MySQL',
      description:
        'MySQL is an open-source relational database management system.',
    },
    {
      title: 'Django',
      description:
        'Django is a high-level Python web framework for rapid development.',
    },
    {
      title: 'Spring',
      description:
        'Spring is a Java framework for building enterprise-level applications.',
    },
    {
      title: 'Laravel',
      description: 'Laravel is a PHP framework for building web applications.',
    },
    {
      title: 'Flutter',
      description:
        'Flutter is an open-source UI software development toolkit by Google.',
    },
    {
      title: 'Kotlin',
      description:
        'Kotlin is a modern programming language targeting JVM and Android.',
    },
    {
      title: 'Bootstrap',
      description:
        'Bootstrap is a framework for developing responsive web designs.',
    },
    {
      title: 'MongoDB',
      description:
        'MongoDB is a NoSQL database for storing JSON-like documents.',
    },
    {
      title: 'Express.js',
      description: 'Express.js is a web framework for Node.js.',
    },
    {
      title: 'Ruby on Rails',
      description: 'Ruby on Rails is a server-side web application framework.',
    },
    {
      title: 'PostgreSQL',
      description:
        'PostgreSQL is an advanced, open-source relational database.',
    },
    { title: 'GraphQL', description: 'GraphQL is a query language for APIs.' },
    {
      title: 'Firebase',
      description:
        'Firebase is a platform developed by Google for app development.',
    },
    {
      title: 'Docker',
      description: 'Docker is a tool for creating and managing containers.',
    },
    {
      title: 'Redis',
      description: 'Redis is an open-source in-memory data structure store.',
    },
    {
      title: 'Git',
      description: 'Git is a distributed version control system.',
    },
    {
      title: 'Webpack',
      description: 'Webpack is a module bundler for JavaScript.',
    },
    {
      title: 'Kubernetes',
      description:
        'Kubernetes is an open-source system for automating deployment.',
    },
    {
      title: 'Nginx',
      description: 'Nginx is a web server and reverse proxy server.',
    },
    {
      title: 'TensorFlow',
      description: 'TensorFlow is an open-source machine learning framework.',
    },
    {
      title: 'Pandas',
      description:
        'Pandas is a Python library for data analysis and manipulation.',
    },
    {
      title: 'NumPy',
      description: 'NumPy is a Python library for numerical computations.',
    },
    {
      title: 'Unity',
      description:
        'Unity is a cross-platform game engine for creating 2D/3D games.',
    },
    {
      title: 'Blender',
      description:
        'Blender is a 3D creation suite for modeling, animation, and rendering.',
    },
    {
      title: 'AWS',
      description: 'AWS is a cloud computing platform by Amazon.',
    },
    {
      title: 'Azure',
      description: "Azure is Microsoft's cloud computing platform.",
    },
    {
      title: 'React Native',
      description:
        'React Native is a framework for building native apps using React.',
    },
    {
      title: 'Rust',
      description:
        'Rust is a systems programming language for safety and concurrency.',
    },
    {
      title: 'Go',
      description:
        'Go is a statically typed, compiled programming language by Google.',
    },
    {
      title: 'Figma',
      description: 'Figma is a web-based interface design tool.',
    },
    {
      title: 'Tailwind CSS',
      description:
        'Tailwind CSS is a utility-first CSS framework for styling websites.',
    },
  ];

  await categoryRepository.save(categories);

  const post1 = new Post();
  post1.title = 'How to build a tech startup';
  post1.content = 'Content of the post about building a startup';
  post1.status = PostStatus.active;
  post1.author = user1;
  post1.categories = [category1, category4];

  const post2 = new Post();
  post2.title = 'Healthy living tips';
  post2.content = 'Content about living a healthy life';
  post2.status = PostStatus.active;
  post2.author = user2;
  post2.categories = [category2, category3];

  const post3 = new Post();
  post3.title = 'Best Practices in Business';
  post3.content = 'Content about effective business practices';
  post3.status = PostStatus.active;
  post3.author = user3;
  post3.categories = [category4];

  const post4 = new Post();
  post4.title = 'The Importance of Education';
  post4.content = 'Content about the role of education in personal development';
  post4.status = PostStatus.active;
  post4.author = user4;
  post4.categories = [category5];

  await postRepository.save([post1, post2, post3, post4]);

  const comment1 = new Comment();
  comment1.content = 'Great article!';
  comment1.status = CommentStatus.active;
  comment1.author = user2;
  comment1.post = post1;

  const comment2 = new Comment();
  comment2.content = 'Thanks for the tips!';
  comment2.status = CommentStatus.active;
  comment2.author = user1;
  comment2.post = post2;

  const comment3 = new Comment();
  comment3.content = 'Very informative, I loved the advice.';
  comment3.status = CommentStatus.active;
  comment3.author = user3;
  comment3.post = post3;

  const comment4 = new Comment();
  comment4.content = 'Inspiring post!';
  comment4.status = CommentStatus.active;
  comment4.author = user4;
  comment4.post = post4;

  await commentRepository.save([comment1, comment2, comment3, comment4]);

  const like1 = new Like();
  like1.user = user1;
  like1.type = 'like';
  like1.entityType = 'post';
  like1.post = post1;

  const like2 = new Like();
  like2.user = user2;
  like2.type = 'like';
  like2.entityType = 'comment';
  like2.comment = comment1;

  const like3 = new Like();
  like3.user = user3;
  like3.type = 'like';
  like3.entityType = 'post';
  like3.post = post3;

  const like4 = new Like();
  like4.user = user4;
  like4.type = 'dislike';
  like4.entityType = 'post';
  like4.post = post4;

  await likeRepository.save([like1, like2, like3, like4]);

  const favorite1 = new Favorite();
  favorite1.user = user1;
  favorite1.post = post2;

  const favorite2 = new Favorite();
  favorite2.user = user2;
  favorite2.post = post3;

  const favorite3 = new Favorite();
  favorite3.user = user3;
  favorite3.post = post4;

  const favorite4 = new Favorite();
  favorite4.user = user4;
  favorite4.post = post1;

  await favoriteRepository.save([favorite1, favorite2, favorite3, favorite4]);

  console.log('Seeding complete!');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
