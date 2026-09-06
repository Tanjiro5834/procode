// ProCode content data — lessons and quizzes.
// Structure is deliberately flat/serializable so new tiers (Laravel, PHP intermediate/advanced
// lesson expansion, etc.) can be appended without touching app logic.

const CONTENT = {

  javaGate: {
    id: "java-gate",
    title: "Java Skills Check",
    description: "Answer 15 questions spanning basic to advanced Java. Score 80% or higher to unlock Spring Boot.",
    passThreshold: 0.8,
    questions: [
      { q: "What is the correct file extension for a Java source file?", options: [".jav", ".class", ".java", ".jvm"], answer: 2 },
      { q: "Which keyword is used to create a class in Java?", options: ["class", "struct", "def", "object"], answer: 0 },
      { q: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Java Virtual Method"], answer: 0 },
      { q: "Which of these is a primitive type in Java?", options: ["String", "Integer", "int", "Object"], answer: 2 },
      { q: "What does the 'public static void main' method represent?", options: ["A constructor", "The entry point of a Java program", "An interface method", "A getter"], answer: 1 },
      { q: "Which keyword prevents a class from being subclassed?", options: ["static", "private", "final", "abstract"], answer: 2 },
      { q: "What is the parent class of all classes in Java?", options: ["Main", "Object", "Class", "Root"], answer: 1 },
      { q: "Which collection maintains key-value pairs?", options: ["ArrayList", "HashSet", "HashMap", "LinkedList"], answer: 2 },
      { q: "What does '==' compare when used on two objects (not primitives)?", options: ["Field values", "Reference/memory address", "Hash codes only", "Nothing, it's invalid"], answer: 1 },
      { q: "Which keyword is used to handle exceptions?", options: ["catch", "except", "rescue", "handle"], answer: 0 },
      { q: "What is method overloading?", options: ["Redefining a method in a subclass", "Multiple methods with the same name but different parameters", "Calling a method too many times", "Using too many arguments"], answer: 1 },
      { q: "Which access modifier restricts visibility to the same class only?", options: ["public", "protected", "default", "private"], answer: 3 },
      { q: "What does the 'this' keyword refer to?", options: ["The parent class", "The current instance", "A static field", "The main method"], answer: 1 },
      { q: "Which interface must a class implement to be used in a for-each loop?", options: ["Comparable", "Iterable", "Runnable", "Serializable"], answer: 1 },
      { q: "What is the purpose of the 'volatile' keyword?", options: ["Marks a method as deprecated", "Ensures visibility of a variable across threads", "Prevents inheritance", "Declares a constant"], answer: 1 }
    ]
  },

  topics: {
    springboot: {
      id: "springboot",
      name: "Spring Boot",
      theme: "springboot",
      locked: true, // unlocked once javaGate is passed
      description: "Build production-ready Java web applications with Spring Boot.",
      lessons: [
        {
          id: "sb-1",
          title: "What is Spring Boot?",
          content: `Spring Boot is a framework that removes the boilerplate from building Spring applications. Instead of configuring a web server, dependency injection, and project structure by hand, Spring Boot gives you sensible defaults and auto-configuration so you can focus on business logic.

A minimal Spring Boot app has one entry point:

\`\`\`
@SpringBootApplication
public class ProCodeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProCodeApplication.class, args);
    }
}
\`\`\`

@SpringBootApplication combines three annotations: @Configuration, @EnableAutoConfiguration, and @ComponentScan. This single line tells Spring to scan your package for components, auto-configure beans based on what's on the classpath, and treat this class as a configuration source.

Spring Boot embeds a server (Tomcat by default), so running the app starts a live web server on port 8080 with zero manual setup.`,
          quiz: {
            questions: [
              { q: "What does @SpringBootApplication combine?", options: ["Only @Controller", "@Configuration, @EnableAutoConfiguration, @ComponentScan", "Only @ComponentScan", "@Entity and @Repository"], answer: 1 },
              { q: "What server does Spring Boot embed by default?", options: ["Nginx", "Apache", "Tomcat", "IIS"], answer: 2 },
              { q: "What is the main benefit of Spring Boot over plain Spring?", options: ["It's a different language", "Auto-configuration and less boilerplate", "It removes dependency injection", "It only works with PHP"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-2",
          title: "REST Controllers and Dependency Injection",
          content: `Spring Boot handles HTTP requests through controllers. A @RestController marks a class whose methods return data directly (usually JSON) rather than rendering a view.

\`\`\`
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
\`\`\`

Notice UserService is passed into the constructor, not created with 'new'. This is dependency injection: Spring creates and manages the UserService bean, then hands it to whatever needs it. You depend on an abstraction, and Spring wires the concrete implementation for you.

@PathVariable extracts {id} from the URL. @RequestBody would extract a JSON body on a POST request. @GetMapping, @PostMapping, @PutMapping, and @DeleteMapping map HTTP methods to Java methods.`,
          quiz: {
            questions: [
              { q: "What does @RestController do differently from @Controller?", options: ["Nothing, they're identical", "Returns data (e.g. JSON) directly instead of a view", "Only works with databases", "Disables routing"], answer: 1 },
              { q: "In the example, how does UserController get its UserService?", options: ["It creates it with 'new'", "Via constructor injection by Spring", "It's hardcoded", "It's not needed"], answer: 1 },
              { q: "What annotation extracts a value from the URL path?", options: ["@RequestBody", "@RequestParam", "@PathVariable", "@Header"], answer: 2 }
            ]
          }
        }
      ]
    },

    php: {
      id: "php",
      name: "PHP",
      theme: "php",
      locked: false,
      description: "Learn PHP from procedural basics through OOP and MVC architecture.",
      tiers: {
        basic: {
          label: "Basic",
          lessons: [
            {
              id: "php-b-1",
              title: "Variables, Types, and Echo",
              content: `PHP is a server-side scripting language. Code runs inside <?php ?> tags and executes on the server before HTML is sent to the browser.

\`\`\`
<?php
    $name = "ProCode";
    $version = 1;
    $isFree = true;

    echo "Welcome to " . $name;
?>
\`\`\`

Variables start with $ and don't need a declared type — PHP infers it. $name is a string, $version is an int, $isFree is a bool. The dot (.) concatenates strings.

PHP is loosely typed: "5" + 5 evaluates to 10 because PHP converts the string to a number in a numeric context. This flexibility is convenient but can cause bugs — always validate input from forms or APIs before trusting its type.`,
              quiz: {
                questions: [
                  { q: "How do you start a block of PHP code?", options: ["<script php>", "<?php", "<%php", "#php"], answer: 1 },
                  { q: "What operator concatenates strings in PHP?", options: ["+", "&", ".", "::"], answer: 2 },
                  { q: "Do PHP variables require an explicit type declaration?", options: ["Yes, always", "No, types are inferred", "Only for strings", "Only in classes"], answer: 1 }
                ]
              }
            },
            {
              id: "php-b-2",
              title: "Conditionals, Loops, and Arrays",
              content: `PHP control structures look close to C/Java:

\`\`\`
$scores = [80, 92, 55, 71];

foreach ($scores as $score) {
    if ($score >= 80) {
        echo "$score: Pass\\n";
    } else {
        echo "$score: Fail\\n";
    }
}
\`\`\`

Arrays in PHP are ordered maps — they work as both indexed lists ([0, 1, 2...]) and associative arrays (string keys):

\`\`\`
$user = [
    "name" => "Nath",
    "role" => "student"
];

echo $user["name"]; // Nath

foreach ($user as $key => $value) {
    echo "$key: $value\\n";
}
\`\`\`

This dual nature (list or map) is one of PHP's most-used features — most real PHP code passes data around as associative arrays before OOP is introduced.`,
              quiz: {
                questions: [
                  { q: "What does foreach ($arr as $key => $value) give you access to?", options: ["Only values", "Only keys", "Both keys and values", "Nothing, invalid syntax"], answer: 2 },
                  { q: "Can a PHP array have string keys?", options: ["No, only integers", "Yes, it becomes an associative array", "Only in PHP 8+", "Only with a special class"], answer: 1 },
                  { q: "What does $score >= 80 check?", options: ["Assignment", "Reference equality", "Whether score is 80 or greater", "String concatenation"], answer: 2 }
                ]
              }
            }
          ]
        },
        intermediate: {
          label: "Intermediate",
          lessons: [
            {
              id: "php-i-1",
              title: "Object-Oriented PHP",
              content: `PHP supports full OOP: classes, interfaces, inheritance, and visibility modifiers.

\`\`\`
class User {
    private string $name;
    private string $role;

    public function __construct(string $name, string $role = "student") {
        $this->name = $name;
        $this->role = $role;
    }

    public function getName(): string {
        return $this->name;
    }

    public function isAdmin(): bool {
        return $this->role === "admin";
    }
}

$user = new User("Nath");
echo $user->getName();
\`\`\`

$this refers to the current instance, same as Java. Type hints (string, bool) and return types are optional but strongly recommended — they catch bugs earlier and make code self-documenting. Constructor property defaults ($role = "student") avoid needing overloaded constructors, which PHP doesn't support natively.`,
              quiz: {
                questions: [
                  { q: "What does $this refer to in a PHP class method?", options: ["The class definition", "The current object instance", "A static property", "The parent class"], answer: 1 },
                  { q: "Does PHP support constructor overloading like Java?", options: ["Yes, natively", "No — use default parameter values instead", "Only in interfaces", "Only with traits"], answer: 1 },
                  { q: "What does 'private' restrict?", options: ["Nothing in PHP", "Access to outside the declaring class", "Only static methods", "Return types"], answer: 1 }
                ]
              }
            }
          ]
        },
        advanced: {
          label: "Advanced",
          lessons: [
            {
              id: "php-a-1",
              title: "MVC with PDO: Controller → Service → Repository",
              content: `Production PHP apps separate concerns into layers, similar to Spring Boot's Controller → Service → Repository pattern:

\`\`\`
// Repository: only knows how to talk to the database
class UserRepository {
    public function __construct(private PDO $pdo) {}

    public function findById(int $id): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}

// Service: business logic, calls the repository
class UserService {
    public function __construct(private UserRepository $repo) {}

    public function getUserProfile(int $id): array {
        $user = $this->repo->findById($id);
        if (!$user) {
            throw new RuntimeException("User not found");
        }
        return $user;
    }
}

// Controller: handles the HTTP request, calls the service
class UserController {
    public function __construct(private UserService $service) {}

    public function show(int $id): void {
        header("Content-Type: application/json");
        echo json_encode($this->service->getUserProfile($id));
    }
}
\`\`\`

Always use prepared statements (:id placeholders) rather than string-concatenating SQL — this is what prevents SQL injection. PDO::FETCH_ASSOC returns rows as associative arrays instead of numbered + named duplicate keys.

This mirrors Spring Boot almost exactly: Repository = @Repository, Service = @Service, Controller = @RestController. The difference is Spring wires these together via dependency injection automatically; in plain PHP, you wire them manually (often in an index.php bootstrap file or a small container).`,
              quiz: {
                questions: [
                  { q: "Why use prepared statements (:id) instead of concatenating SQL strings?", options: ["They're shorter to type", "They prevent SQL injection", "They're required by PHP syntax", "They run faster always"], answer: 1 },
                  { q: "In the Controller→Service→Repository pattern, which layer talks to the database?", options: ["Controller", "Service", "Repository", "All three equally"], answer: 2 },
                  { q: "What is the closest Spring Boot equivalent to a PHP Repository class?", options: ["@RestController", "@Repository", "@Configuration", "@Bean"], answer: 1 }
                ]
              }
            }
          ]
        }
      }
    }
  }
};
