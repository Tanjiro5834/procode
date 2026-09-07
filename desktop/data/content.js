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

Spring Boot embeds a server (Tomcat by default), so running the app starts a live web server on port 8080 with zero manual setup.

One common real-world use is changing the port number. For example, if port 8080 is already in use, you can tell Spring Boot to start on a different port by adding a single line to your application.properties file:

\`\`\`
server.port=9090
\`\`\`

That's it — no code changes, no configuration classes. Spring Boot reads this property at startup and runs the embedded server on port 9090 instead. This shows how external configuration can adjust behavior without touching your Java code, which is very handy when deploying the same JAR to different environments (like development, testing, and production). You can also change the port via command-line arguments (e.g., --server.port=9091) for even more flexibility.`,
          quiz: {
            questions: [
              { q: "What does @SpringBootApplication combine?", options: ["Only @Controller", "@Configuration, @EnableAutoConfiguration, @ComponentScan", "Only @ComponentScan", "@Entity and @Repository"], answer: 1 },
              { q: "What server does Spring Boot embed by default?", options: ["Nginx", "Apache", "Tomcat", "IIS"], answer: 2 },
              { q: "What is the main benefit of Spring Boot over plain Spring?", options: ["It's a different language", "Auto-configuration and less boilerplate", "It removes dependency injection", "It only works with PHP"], answer: 1 },
              { q: "How can you change the embedded server port without modifying Java code?", options: ["Edit the main() method", "Set server.port in application.properties", "Use a different @SpringBootApplication annotation", "Recompile the JAR with a new port"], answer: 1 }
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
        },
        {
          id: "sb-9",
          title: "Spring Security Basics",
          content: `Spring Security handles authentication (who you are) and authorization (what you can do) for your app. Instead of writing login checks in every controller, you define security rules once and Spring applies them automatically.

To start, add the Spring Security dependency and create a configuration class annotated with @EnableWebSecurity. This tells Spring to use your custom security rules instead of the default ones (which require a randomly generated password for every restart).

\`\`\`
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**", "/register").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(Customizer.withDefaults())
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
\`\`\`

The authorizeHttpRequests block sets rules: "/public/**" and "/register" are open to everyone, while any other request requires authentication. permitAll() means no login needed. authenticated() means the user must be logged in. .formLogin() adds a default login page, and .httpBasic() lets you send credentials in HTTP headers (common for APIs).

Password encoding is critical — you never store plain-text passwords. BCryptPasswordEncoder hashes passwords using a salt (random data added before hashing) so even if two users have the same password, their stored hashes look different. When a user logs in, Spring takes the submitted password, runs it through the encoder, and compares it to the stored hash.

To actually store users, you create a service that implements UserDetailsService. This tells Spring how to find users by username from your database.

\`\`\`
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword()) // already encoded
            .roles(user.getRole()) // e.g., "ADMIN", "USER"
            .build();
    }
}
\`\`\`

loadUserByUsername is called automatically by Spring when a login attempt happens. It takes the username from the login form, looks it up in your database, and returns a Spring UserDetails object containing the username, encoded password, and role list. Spring then compares the submitted password with the stored encoded one using the PasswordEncoder you configured.

A common pattern is creating users with encoded passwords during registration:

\`\`\`
@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);
    }
}
\`\`\`

Never store raw passwords — always call passwordEncoder.encode() before saving to the database. Roles are stored as simple strings like "USER" or "ADMIN", and Spring automatically prefixes them with "ROLE_" internally when checking authorization.`,
          quiz: {
            questions: [
              { q: "What does @EnableWebSecurity do?", options: ["It enables HTTPS", "It activates your custom security configuration", "It disables all security", "It generates a random password"], answer: 1 },
              { q: "Why should you always use a PasswordEncoder like BCryptPasswordEncoder?", options: ["It's the only option Spring supports", "It prevents plain-text passwords from being stored in the database", "It makes login faster", "It encrypts the database connection"], answer: 1 },
              { q: "When a user submits a login form, what does Spring Security compare the submitted password against?", options: ["The raw password stored in the database", "The encoded password hash stored in the database, using the PasswordEncoder", "A session token", "The password in the application.properties file"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-10",
          title: "Testing Spring Boot Apps",
          content: `Testing ensures your code works correctly as you add features. Spring Boot provides tools to test your application without starting the full server each time, making tests fast and reliable.

The most important testing annotation is @SpringBootTest. It loads the full application context (all your beans) so you can test how pieces work together. For controllers, you can combine it with @AutoConfigureMockMvc, which gives you MockMvc — a tool that simulates HTTP requests without actually opening a network port.

\`\`\`
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getUsers_returns200ForAdmin() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getUsers_returns401WhenNotLoggedIn() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isUnauthorized());
    }
}
\`\`\`

MockMvc lets you call endpoints with .perform(get("/url")) or .perform(post("/url").content(json)). The .andExpect() chain checks the response — status code (200 means OK, 401 means unauthorized), JSON structure, or specific values. @WithMockUser creates a fake logged-in user with given roles, so you can test security rules without setting up a real login.

For testing services, you can use @SpringBootTest alone and autowire the service you want to test. But for faster tests, you can use @MockBean to replace real dependencies with fake ones (mocks) that don't hit the database.

\`\`\`
@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    void getUserProfile_returnsUserWhenExists() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Alice");

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        UserProfile result = userService.getUserProfile(1L);

        assertEquals("Alice", result.getName());
        verify(userRepository).findById(1L);
    }

    @Test
    void getUserProfile_throwsWhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserProfile(99L);
        });
    }
}
\`\`\`

@MockBean creates a dummy version of UserRepository that doesn't talk to the database. You use when() to tell it what to return when certain methods are called. verify() checks that the method was called with the right arguments — this confirms your service actually used the repository correctly. This approach tests the service's logic in isolation, running in milliseconds instead of seconds.

For database-related tests, use @DataJpaTest instead of @SpringBootTest — it only loads JPA components and uses an in-memory database by default, making tests even faster. And when you need to start the actual server and send real HTTP requests (like integration tests with external APIs), use @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) and inject a TestRestTemplate.`,
          quiz: {
            questions: [
              { q: "What does @AutoConfigureMockMvc provide in a test?", options: ["A real web server on port 8080", "A tool to simulate HTTP requests without starting the server", "An automatic database connection", "A test login page"], answer: 1 },
              { q: "When would you use @MockBean in a service test?", options: ["To start the real database", "To replace a real repository with a fake one that returns controlled data", "To test the controller's JSON output", "To generate random test data"], answer: 1 },
              { q: "What does @WithMockUser do in a controller test?", options: ["It creates a real user in the database", "It simulates an authenticated user for testing security rules", "It encrypts the test request", "It disables all security during the test"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-11",
          title: "Caching",
          content: `Caching stores the result of expensive operations (like database queries or external API calls) so repeated requests return quickly without repeating the work. Spring Boot makes caching easy with annotations — just add @EnableCaching to a configuration class and @Cacheable to the methods you want to cache.

Think of caching like a map: the method arguments are the key, and the return value is the value. The first time you call a cached method with certain arguments, Spring runs the method and stores the result. The next time you call it with the same arguments, Spring returns the stored value without running the method at all.

\`\`\`
@Configuration
@EnableCaching
public class CacheConfig {
    // No code needed here — @EnableCaching turns on caching support
}

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        System.out.println("Fetching product from database: " + id);
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Cacheable(value = "productList")
    public List<Product> getAllProducts() {
        System.out.println("Fetching all products from database");
        return productRepository.findAll();
    }
}
\`\`\`

@Cacheable(value = "products", key = "#id") means "store the result in a cache named 'products' using the method's id parameter as the key." The first call to getProduct(1) runs the database query and stores the Product under key "1". The second call with id=1 returns the cached Product instantly — you'll see no "Fetching product from database" message. If you call getProduct(2), that's a different key, so the database query runs and caches that result separately.

Caching helps most with data that changes rarely (like product catalogs, dropdown options, or country lists) and is expensive to fetch (like complex joins or slow external APIs). It's less useful for frequently changing data like order statuses or user balances — stale cached data would cause problems.

When data does change, you need to update or remove cached entries. Use @CacheEvict to clear the cache after changes:

\`\`\`
@Service
public class ProductService {

    @CacheEvict(value = "productList", allEntries = true)
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @CachePut(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }
}
\`\`\`

@CacheEvict removes entries from the cache. With allEntries = true, it clears the entire productList cache when you add a new product (because the list now has one more item). With key = "#id", it only removes the specific product that was deleted. @CachePut updates the cache with the new value — it always runs the method and stores the result, useful when updating data so the cache stays fresh.

Spring Boot supports multiple caching providers: ConcurrentHashMap (in-memory, default), Redis (distributed, good for multiple servers), and EhCache. For simple use, the default works fine. For production with multiple app instances, use Redis or a shared cache so all instances see the same cached data.`,
          quiz: {
            questions: [
              { q: "What does @Cacheable do when a method is called with the same arguments repeatedly?", options: ["It runs the method every time", "It returns the cached result without running the method again", "It caches the method name only", "It deletes the previous cache entry"], answer: 1 },
              { q: "Which annotation removes entries from the cache when data changes?", options: ["@CacheRemove", "@CacheEvict", "@CacheDelete", "@CacheFlush"], answer: 1 },
              { q: "What kind of data is a good candidate for caching?", options: ["Frequently changing data like user session state", "Data that is expensive to fetch and changes rarely", "Every method in the application", "Large binary files"], answer: 1 }
            ]
          }
        },
        {
          id: "sb-12",
          title: "Building and Deploying",
          content: `Building and deploying turns your code into a running application that users can access. With Spring Boot, you package your app as a JAR file (Java ARchive) that contains everything — code, dependencies, and the embedded server — so you can run it with a single java -jar command.

To build a JAR, use the Maven Wrapper that comes with Spring Boot projects. In your terminal, navigate to your project folder and run:

\`\`\`
./mvnw clean package
\`\`\`

This compiles your code, runs tests, and packages everything into a JAR file inside the target/ folder. The JAR name looks like myapp-0.0.1-SNAPSHOT.jar. The 'clean' part deletes old build files first, and 'package' creates the new JAR. The result is a self-contained file — you can copy it to any server with Java installed and run it.

To run the JAR:

\`\`\`
java -jar target/myapp-0.0.1-SNAPSHOT.jar
\`\`\`

The application starts on port 8080 (or whatever you set in application.properties). You can override properties at runtime without rebuilding:

\`\`\`
java -jar myapp.jar --server.port=9090 --spring.profiles.active=prod
\`\`\`

This starts the same JAR on port 9090 using the 'prod' profile. That's the power of externalized configuration — one JAR works everywhere.

For a more production-ready approach, Docker packages your app with its environment (Java version, operating system, ports) into a container that runs the same way anywhere — your laptop, a test server, or the cloud. A Dockerfile tells Docker how to build the container:

\`\`\`
# Dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/myapp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

FROM specifies the base image — here, Java 17 on a slim Linux. WORKDIR sets the working directory inside the container. COPY copies your JAR from your computer into the container's /app folder with the name app.jar. EXPOSE tells Docker that the container uses port 8080 (it doesn't open the port, just documents it). ENTRYPOINT is the command that runs when the container starts.

To build the Docker image:

\`\`\`
docker build -t myapp .
\`\`\`

This reads the Dockerfile in the current directory (.) and creates an image named myapp. The -t flag tags it with a name so you can refer to it easily.

To run the container:

\`\`\`
docker run -p 8080:8080 myapp
\`\`\`

-p 8080:8080 maps port 8080 on your computer to port 8080 inside the container. Your app runs inside the container but is accessible at http://localhost:8080 on your machine. Docker makes deployment consistent — if it runs in Docker on your machine, it runs the same way in the cloud.

For production, you can also use Docker Compose to run multiple containers together (your app, a MySQL database, Redis cache). But even a simple docker run on a server with Docker installed is a big step toward professional deployment.`,
          quiz: {
            questions: [
              { q: "What command builds a JAR file from a Spring Boot project?", options: ["java -jar target/app.jar", "./mvnw clean package", "docker build -t app .", "spring build jar"], answer: 1 },
              { q: "What is the purpose of a Dockerfile in a Spring Boot project?", options: ["To write Java code", "To define how to package the app into a container with its environment", "To configure the database connection", "To generate application.properties"], answer: 1 },
              { q: "Which part of the Dockerfile specifies the command that runs when the container starts?", options: ["FROM", "COPY", "EXPOSE", "ENTRYPOINT"], answer: 3 }
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