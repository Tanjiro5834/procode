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
        },
        {
          id: "sb-3",
          title: "Application Properties and Configuration",
          content: `Spring Boot externalizes configuration using application.properties or application.yml. These files let you change behavior without touching code — database URLs, server ports, logging levels, and custom settings all live here. The environment picks up these properties at startup and binds them to your beans.

\`\`\`
# application.properties
server.port=9090
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret

app.custom.timeout=30
app.custom.feature-enabled=true
\`\`\`

You can access these values in your code using @Value("\${property.key}") or by binding them to a typed configuration properties class. The latter is cleaner for groups of related settings — just annotate a POJO with @ConfigurationProperties and Spring will populate it automatically.

\`\`\`
@Component
@ConfigurationProperties(prefix = "app.custom")
public class AppProperties {
    private int timeout;
    private boolean featureEnabled;

    // getters and setters
}
\`\`\`

Properties are resolved hierarchically — command-line arguments override environment variables, which override application.properties. This makes it easy to run the same JAR in different environments by passing -D flags or using OS environment variables.`,
          quiz: {
            questions: [
              { q: "Which file can Spring Boot use for external configuration?", options: ["application.properties", "config.xml", "settings.json", "app.conf"], answer: 0 },
              { q: "How do you inject a property value like app.custom.timeout into a field?", options: ["@Inject(\"\${app.custom.timeout}\")", "@Value(\"\${app.custom.timeout}\")", "@Property(\"app.custom.timeout\")", "@Config(\"app.custom.timeout\")"], answer: 1 },
              { q: "What does the prefix attribute do in @ConfigurationProperties(prefix = \"app.custom\")?", options: ["It sets the file path", "It defines the YAML section to bind", "It maps all properties starting with that prefix", "It enables validation"], answer: 2 }
            ]
          }
        },
        {
          id: "sb-4",
          title: "Spring Data JPA Basics",
          content: `Spring Data JPA eliminates boilerplate data access code by providing repository interfaces that implement common operations automatically. You define an interface that extends JpaRepository, specifying your entity type and its ID type, and you get methods like save(), findById(), findAll(), and delete() without writing any implementation.

\`\`\`
@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double price;

    // constructors, getters, setters
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query methods can be added here
}
\`\`\`

To use the repository, inject it into your service or controller. Calling productRepository.save(product) persists the entity to the database. findById(id) returns an Optional, so you should handle the empty case properly. Spring Data JPA converts method names into queries automatically — for example, findByName(String name) generates a query by the name field.

\`\`\`
@RestController
public class ProductController {
    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}
\`\`\`

Transactions are handled by Spring automatically when you call repository methods. For multiple operations in a service method, you can annotate the method with @Transactional to ensure all saves succeed or roll back together.`,
          quiz: {
            questions: [
              { q: "Which interface should you extend to get basic CRUD methods for an entity?", options: ["CrudRepository", "JpaRepository", "Both A and B", "Repository"], answer: 2 },
              { q: "What does repository.findById(id) return?", options: ["The entity directly", "Optional<T>", "List<T>", "Future<T>"], answer: 1 },
              { q: "How does Spring Data JPA implement a method like findByName(String name)?", options: ["By SQL reflection", "By parsing the method name and generating a query", "By using a stored procedure", "By requiring an @Query annotation"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-5",
          title: "Request Validation",
          content: `Spring Boot integrates with Bean Validation (Jakarta Validation) to validate incoming request bodies and parameters automatically. You annotate fields in your request DTO with constraints like @NotNull, @Size, @Min, @Max, @Email, and then add @Valid before the parameter in your controller method. If validation fails, Spring throws a MethodArgumentNotValidException and returns a 400 Bad Request.

\`\`\`
public class CreateOrderRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @Size(min = 1, max = 10, message = "Must have 1-10 items")
    private List<OrderItem> items;

    @Min(1)
    @Max(100)
    private double discountPercent;

    // getters and setters
}

@PostMapping("/orders")
public Order createOrder(@Valid @RequestBody CreateOrderRequest request) {
    return orderService.create(request);
}
\`\`\`

You can also validate path variables and query parameters by adding @Validated to the controller and using validation annotations directly on parameters. For custom validation logic, create your own annotation with a validator class that implements ConstraintValidator.

\`\`\`
@RestController
@Validated
public class OrderController {
    @GetMapping("/orders/{id}")
    public Order getOrder(@PathVariable @Min(1) Long id) {
        return orderService.findById(id);
    }
}
\`\`\`

When validation errors occur, the default response includes a list of field errors. You can customize this by handling MethodArgumentNotValidException in an @ExceptionHandler, or by using a global ControllerAdvice to format all validation responses consistently.`,
          quiz: {
            questions: [
              { q: "Which annotation marks a request body for validation in a controller?", options: ["@Validate", "@Valid", "@Validated", "@Validation"], answer: 1 },
              { q: "What exception is thrown when @Valid validation fails?", options: ["ValidationException", "InvalidParameterException", "MethodArgumentNotValidException", "ConstraintViolationException"], answer: 2 },
              { q: "What HTTP status does Spring return by default for a validation failure?", options: ["500 Internal Server Error", "400 Bad Request", "422 Unprocessable Entity", "404 Not Found"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-6",
          title: "Exception Handling",
          content: `Spring Boot provides several ways to handle exceptions across your application. The simplest is using @ExceptionHandler inside a controller to catch exceptions thrown by that controller's methods. For global handling, you create a class annotated with @ControllerAdvice, which intercepts exceptions from any controller in your application.

\`\`\`
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, List<String>> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(error -> errors.computeIfAbsent(error.getField(), 
                k -> new ArrayList<>()).add(error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}
\`\`\`

You can define your own custom exceptions (like ResourceNotFoundException) and throw them from services. The controller advice catches them and transforms the exception into a structured HTTP response with the appropriate status code and message.

\`\`\`
@Service
public class ProductService {
    private final ProductRepository repository;

    public Product getProduct(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product " + id));
    }
}

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
\`\`\`

Always include a fallback handler for generic exceptions like Exception to prevent leaking internal stack traces. Order matters — Spring matches the most specific exception handler first, then falls back to broader ones.`,
          quiz: {
            questions: [
              { q: "Which annotation defines a global exception handler for all controllers?", options: ["@RestControllerAdvice", "@ControllerAdvice", "@GlobalAdvice", "@ExceptionAdvice"], answer: 1 },
              { q: "What should you use to map an exception to a specific HTTP status and body?", options: ["ResponseStatusException", "Returning ResponseEntity in @ExceptionHandler", "Throwing HttpStatusException", "Using @ResponseStatus on the exception class"], answer: 1 },
              { q: "If you have handlers for Exception and RuntimeException, which one handles a NullPointerException?", options: ["Exception handler", "RuntimeException handler", "Both", "Neither"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-7",
          title: "Layered Architecture in Spring Boot",
          content: `Spring Boot applications typically follow a layered architecture: Controller layer handles HTTP requests and responses, Service layer contains business logic and transaction boundaries, and Repository layer handles data persistence. This separation keeps each layer focused and makes the code easier to test and maintain.

\`\`\`
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.placeOrder(request);
    }
}
\`\`\`

The service layer is where business rules live. It orchestrates multiple repositories, applies validation beyond simple field checks, and marks transactional boundaries. Services are plain Spring beans annotated with @Service, and they should never deal with HTTP concerns like request/response objects.

\`\`\`
@Service
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

    public OrderService(OrderRepository orderRepository, 
                        ProductRepository productRepository,
                        InventoryService inventoryService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
    }

    public OrderResponse placeOrder(CreateOrderRequest request) {
        // Validate inventory, calculate total, apply discounts
        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setItems(request.getItems());
        order.setTotal(calculateTotal(request));
        Order saved = orderRepository.save(order);
        inventoryService.reserveItems(request.getItems());
        return OrderResponse.from(saved);
    }
}
\`\`\`

Inject services into controllers, not repositories directly — this makes the controller thin and the service testable in isolation. For complex domains, you can introduce additional layers like DTO mappers or domain services, but the core pattern remains: controllers delegate to services, services use repositories.`,
          quiz: {
            questions: [
              { q: "What is the primary responsibility of the Service layer?", options: ["Handling HTTP requests", "Business logic and transactions", "Database queries", "Rendering views"], answer: 1 },
              { q: "Which annotation marks a class as a service component?", options: ["@Component", "@Service", "@Bean", "@Repository"], answer: 1 },
              { q: "Why should controllers not call repositories directly?", options: ["It's slower", "It bypasses business logic and transaction management", "It causes circular dependencies", "It's not allowed by Spring"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-8",
          title: "Application Startup and Profiles",
          content: `Spring Boot applications execute a startup sequence that includes property loading, bean creation, and running CommandLineRunner or ApplicationRunner beans. You can hook into startup by implementing these interfaces — useful for seeding data, checking external services, or warming up caches.

\`\`\`
@Component
public class DataLoader implements CommandLineRunner {
    private final ProductRepository repository;

    public DataLoader(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(new Product("Laptop", 999.99));
            repository.save(new Product("Mouse", 29.99));
        }
    }
}
\`\`\`

Profiles let you define environment-specific configuration. You create application-{profile}.properties files (e.g., application-dev.properties, application-prod.properties), and set the active profile via spring.profiles.active. Beans can be conditionally included using @Profile("dev") to run development-only components.

\`\`\`
# application-dev.properties
spring.datasource.url=jdbc:h2:mem:devdb
logging.level.org.springframework=DEBUG

# application-prod.properties
spring.datasource.url=jdbc:mysql://prod-db:3306/proddb
logging.level.org.springframework=WARN
\`\`\`

\`\`\`
@Configuration
public class DevConfig {
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new H2DataSource();
    }

    @Bean
    @Profile("!dev")  // Not active in dev
    public DataSource prodDataSource() {
        return new MysqlDataSource();
    }
}
\`\`\`

Set the active profile using -Dspring.profiles.active=dev on the command line, or in your IDE run configuration. You can also activate multiple profiles (e.g., dev,cloud) and they merge properties with the default application.properties as the base.`,
          quiz: {
            questions: [
              { q: "Which interface allows you to run code right after the Spring context starts?", options: ["StartupRunner", "ApplicationRunner", "InitializingBean", "PostConstruct"], answer: 1 },
              { q: "What file name pattern is used for profile-specific properties?", options: ["application-{profile}.properties", "profile-{profile}.properties", "spring-{profile}.properties", "config-{profile}.properties"], answer: 0 },
              { q: "How do you activate the 'prod' profile when running the JAR?", options: ["-Dspring.profiles.active=prod", "--profile=prod", "-Pprod", "-Dprofile=prod"], answer: 0 }
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