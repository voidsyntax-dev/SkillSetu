import { skill, sub } from "./dsl";

export const computerSkills = [
  skill("programming_fundamentals", "Programming Fundamentals (C/C++ & OOP)", "Core programming in C/C++: memory, pointers and object-oriented design.", { level: 1, category: "foundation", book: "Kernighan & Ritchie — The C Programming Language" }, [
    sub("control_functions", "Control Flow & Functions", "Variables, loops, functions and recursion.", [
      ["Recursion", "Technique where a function solves a problem by calling itself on smaller inputs"],
      ["Base case", "Condition that stops recursion and returns a result directly"],
      ["Pass by reference", "Passing a variable's address so the callee can modify the caller's variable"],
    ]),
    sub("pointers_memory", "Pointers & Memory", "Addresses, the stack and the heap.", [
      ["Pointer", "Variable that stores the memory address of another variable"],
      ["Heap allocation", "Dynamic memory obtained at run time with malloc or new and freed explicitly"],
      ["Memory leak", "Allocated memory that is never freed and can no longer be reached"],
      ["Dangling pointer", "Pointer that still refers to memory that has been freed"],
    ]),
    sub("oop", "Object-Oriented Programming", "Classes, inheritance and polymorphism.", [
      ["Encapsulation", "Bundling data with the methods that operate on it and hiding internal details"],
      ["Inheritance", "Mechanism letting a class acquire properties and behaviour of a parent class"],
      ["Polymorphism", "Ability of one interface to work with objects of different types, e.g. via virtual functions"],
      ["Abstraction", "Exposing only essential features while hiding implementation complexity"],
    ]),
  ]),

  skill("data_structures", "Data Structures", "Arrays, linked lists, stacks, queues, trees, heaps, hash tables and graphs.", { level: 2, deps: ["programming_fundamentals"], book: "Cormen et al. — Introduction to Algorithms" }, [
    sub("linear_structures", "Linear Structures", "Arrays, linked lists, stacks and queues.", [
      ["Stack", "LIFO collection supporting push and pop at one end"],
      ["Queue", "FIFO collection where elements are added at the rear and removed from the front"],
      ["Linked list", "Sequence of nodes where each node holds data and a reference to the next node"],
      ["Dynamic array", "Resizable array that grows by allocating larger storage and copying elements"],
    ], [
      ["Which data structure is used to implement function calls and recursion?", "Stack", ["Queue", "Heap", "Hash table"], "Each call pushes a frame onto the call stack and pops it on return (LIFO).", 1],
    ]),
    sub("trees", "Trees", "Binary trees, BSTs and balanced trees.", [
      ["Binary search tree", "Binary tree where left subtree keys are smaller and right subtree keys larger than the node"],
      ["AVL tree", "Self-balancing BST in which subtree heights differ by at most one"],
      ["Tree traversal (inorder)", "Visiting left subtree, node, then right subtree; gives sorted order for a BST"],
      ["Trie", "Tree that stores strings by character so common prefixes share nodes"],
    ]),
    sub("heaps_hashing", "Heaps & Hashing", "Priority queues and constant-time lookup.", [
      ["Binary heap", "Complete binary tree where each parent is ordered relative to its children"],
      ["Hash table", "Structure mapping keys to array slots with a hash function for average O(1) lookup"],
      ["Collision", "Two different keys hashing to the same slot"],
      ["Load factor", "Ratio of stored entries to the number of slots in a hash table"],
    ]),
    sub("graphs", "Graphs", "Representations and traversal.", [
      ["Adjacency list", "Graph representation storing for each vertex the list of its neighbours"],
      ["Breadth-first search", "Traversal visiting vertices level by level using a queue"],
      ["Depth-first search", "Traversal exploring as far as possible along each branch before backtracking"],
      ["Directed acyclic graph", "Directed graph with no cycles, which always has a topological ordering"],
    ]),
  ]),

  skill("algorithms", "Design & Analysis of Algorithms", "Complexity analysis, sorting, divide and conquer, greedy and dynamic programming.", { level: 2, deps: ["data_structures", "engineering_mathematics"], book: "Kleinberg & Tardos — Algorithm Design" }, [
    sub("complexity", "Complexity Analysis", "Asymptotic notation and recurrences.", [
      ["Big-O notation", "Asymptotic upper bound on how an algorithm's cost grows with input size"],
      ["Master theorem", "Formula solving divide-and-conquer recurrences of the form T(n) = aT(n/b) + f(n)"],
      ["Amortised analysis", "Averaging the cost of operations over a worst-case sequence"],
      ["NP-complete", "Class of problems in NP to which every NP problem reduces in polynomial time"],
    ], [
      ["What is the worst-case time complexity of binary search on a sorted array of n elements?", "O(log n)", ["O(n)", "O(1)", "O(n log n)"], "Each step halves the remaining search space.", 1],
    ]),
    sub("sorting_searching", "Sorting & Searching", "Classic comparison sorts.", [
      ["Merge sort", "Divide-and-conquer sort that splits, sorts halves recursively and merges in O(n log n)"],
      ["Quicksort", "Partition-based sort with O(n log n) average and O(n²) worst case"],
      ["Stable sort", "Sort that preserves the relative order of equal keys"],
    ]),
    sub("greedy_dp", "Greedy & Dynamic Programming", "Optimisation paradigms.", [
      ["Greedy algorithm", "Builds a solution by always taking the locally best choice"],
      ["Dynamic programming", "Solves problems with overlapping subproblems by storing and reusing sub-results"],
      ["Optimal substructure", "Property that an optimal solution contains optimal solutions to its subproblems"],
      ["Memoisation", "Caching the results of function calls to avoid recomputation"],
    ]),
    sub("graph_algorithms", "Graph Algorithms", "Shortest paths and spanning trees.", [
      ["Dijkstra's algorithm", "Single-source shortest paths for graphs with non-negative edge weights"],
      ["Bellman-Ford algorithm", "Shortest paths that handle negative weights and detect negative cycles"],
      ["Minimum spanning tree", "Subset of edges connecting all vertices with minimum total weight and no cycles"],
      ["Topological sort", "Linear ordering of a DAG's vertices so every edge goes forward"],
    ]),
  ]),

  skill("databases", "Database Management Systems", "Relational modelling, SQL, normalisation, transactions and indexing.", { level: 2, deps: ["data_structures"], book: "Silberschatz, Korth & Sudarshan — Database System Concepts" }, [
    sub("relational_model", "Relational Model & ER Design", "Modelling data as tables and relationships.", [
      ["Primary key", "Attribute set that uniquely identifies each row of a table"],
      ["Foreign key", "Attribute that references the primary key of another table"],
      ["ER diagram", "Diagram of entities, attributes and relationships used for conceptual design"],
    ]),
    sub("sql", "SQL", "Querying and manipulating relational data.", [
      ["JOIN", "SQL operation combining rows from tables based on a related column"],
      ["GROUP BY", "Clause aggregating rows that share values in specified columns"],
      ["HAVING", "Clause filtering groups after aggregation"],
      ["Window function", "SQL function computing a value across related rows without collapsing them, e.g. ROW_NUMBER"],
    ], [
      ["Which clause filters rows BEFORE aggregation?", "WHERE", ["HAVING", "ORDER BY", "LIMIT"], "WHERE filters individual rows; HAVING filters groups after GROUP BY.", 1],
    ]),
    sub("normalization", "Normalisation", "Removing redundancy from schemas.", [
      ["Functional dependency", "Constraint that one set of attributes uniquely determines another"],
      ["Third normal form", "Schema with no transitive dependency of non-key attributes on a key"],
      ["BCNF", "Normal form where every determinant of a functional dependency is a superkey"],
    ]),
    sub("transactions_indexing", "Transactions & Indexing", "Concurrency, recovery and fast access.", [
      ["ACID", "Atomicity, consistency, isolation and durability guarantees of transactions"],
      ["B+ tree index", "Balanced tree index with all records in linked leaves, efficient for range queries"],
      ["Deadlock", "State where transactions wait on each other's locks indefinitely"],
      ["Two-phase locking", "Protocol with a growing phase acquiring locks and a shrinking phase releasing them"],
    ]),
  ]),

  skill("operating_systems", "Operating Systems", "Processes, scheduling, synchronisation, memory management and file systems.", { level: 3, deps: ["data_structures"], book: "Silberschatz, Galvin & Gagne — Operating System Concepts" }, [
    sub("processes_threads", "Processes & Threads", "Execution units and context switching.", [
      ["Process", "Program in execution with its own address space and resources"],
      ["Thread", "Lightweight unit of execution that shares its process's address space"],
      ["Context switch", "Saving one process's CPU state and loading another's"],
    ]),
    sub("scheduling", "CPU Scheduling", "Choosing which process runs next.", [
      ["Round robin", "Preemptive scheduling giving each process a fixed time quantum in turn"],
      ["Shortest job first", "Scheduling that runs the process with the smallest next CPU burst, minimising average waiting time"],
      ["Starvation", "Indefinite postponement of a process that never gets the resource it needs"],
    ]),
    sub("synchronization", "Synchronisation & Deadlocks", "Coordinating concurrent processes.", [
      ["Race condition", "Outcome depending on the unpredictable order of concurrent operations"],
      ["Semaphore", "Integer synchronisation variable manipulated only by atomic wait and signal operations"],
      ["Mutex", "Lock ensuring only one thread enters a critical section at a time"],
      ["Banker's algorithm", "Deadlock avoidance algorithm that grants requests only if the system stays in a safe state"],
    ]),
    sub("memory_management", "Memory Management", "Paging, segmentation and virtual memory.", [
      ["Paging", "Dividing memory into fixed-size frames and processes into pages to avoid external fragmentation"],
      ["Page fault", "Trap raised when a program accesses a page not currently in physical memory"],
      ["TLB", "Translation lookaside buffer, a cache of recent virtual-to-physical address translations"],
      ["Thrashing", "Excessive paging that leaves the CPU mostly idle waiting on disk"],
    ]),
  ]),

  skill("computer_networks", "Computer Networks", "Layered architecture, TCP/IP, routing and network security.", { level: 3, deps: ["operating_systems"], book: "Kurose & Ross — Computer Networking: A Top-Down Approach" }, [
    sub("layers", "Network Models", "OSI and TCP/IP layering.", [
      ["OSI model", "Seven-layer reference model from physical to application"],
      ["Encapsulation (networking)", "Wrapping data with each layer's header as it moves down the stack"],
      ["MAC address", "48-bit hardware address identifying a network interface on a local network"],
    ]),
    sub("transport", "Transport Layer", "TCP and UDP.", [
      ["TCP", "Connection-oriented transport protocol providing reliable, ordered delivery"],
      ["UDP", "Connectionless transport protocol with minimal overhead and no delivery guarantee"],
      ["Three-way handshake", "SYN, SYN-ACK, ACK exchange that opens a TCP connection"],
      ["Congestion control", "Mechanisms like slow start that adapt sending rate to network capacity"],
    ]),
    sub("network_layer", "Network Layer & Routing", "IP addressing and routing.", [
      ["Subnet mask", "Bit mask separating the network and host parts of an IP address"],
      ["CIDR", "Classless addressing using prefix lengths such as /24"],
      ["Distance vector routing", "Routing where routers share distance tables with neighbours (e.g. RIP)"],
      ["NAT", "Translating private addresses to a public address at a gateway"],
    ]),
    sub("application_security", "Application Layer & Security", "DNS, HTTP and secure communication.", [
      ["DNS", "Distributed system that resolves domain names to IP addresses"],
      ["HTTPS", "HTTP over TLS, providing encryption and server authentication"],
      ["Firewall", "System that filters traffic according to security rules"],
    ]),
  ]),

  skill("software_engineering", "Software Engineering & System Design", "Development process, testing, design patterns and scalable architecture.", { level: 3, deps: ["programming_fundamentals", "databases"], book: "Martin Kleppmann — Designing Data-Intensive Applications" }, [
    sub("sdlc", "Process & Version Control", "Agile, Scrum and Git workflows.", [
      ["Agile", "Iterative development approach delivering working software in short cycles"],
      ["Sprint", "Fixed time-box in Scrum during which a set of work is completed"],
      ["Git branch", "Independent line of development that can later be merged"],
      ["Continuous integration", "Practice of merging and automatically testing code changes frequently"],
    ]),
    sub("testing", "Software Testing", "Verifying software behaviour.", [
      ["Unit test", "Automated test of a small unit of code in isolation"],
      ["Integration test", "Test that checks components work correctly together"],
      ["Test-driven development", "Writing a failing test before writing the code that makes it pass"],
    ]),
    sub("design_patterns", "Design Principles & Patterns", "Reusable solutions to common design problems.", [
      ["Singleton pattern", "Ensures a class has only one instance with a global access point"],
      ["Observer pattern", "Lets objects subscribe to and be notified of another object's state changes"],
      ["SOLID", "Five object-oriented design principles that make code maintainable and extensible"],
    ]),
    sub("system_design", "System Design", "Designing scalable distributed systems.", [
      ["Horizontal scaling", "Adding more machines to handle increased load"],
      ["Load balancer", "Component distributing incoming requests across multiple servers"],
      ["Caching", "Storing frequently used data in fast storage to reduce latency and load"],
      ["CAP theorem", "A distributed store cannot simultaneously guarantee consistency, availability and partition tolerance"],
    ]),
  ]),

  skill("web_development", "Web Development", "HTML, CSS, JavaScript, React and backend APIs.", { level: 2, category: "tools", deps: ["programming_fundamentals"], book: "MDN Web Docs — Learn Web Development" }, [
    sub("html_css", "HTML & CSS", "Structure and styling of web pages.", [
      ["Semantic HTML", "Using elements like header, nav and article that describe the meaning of content"],
      ["Flexbox", "CSS layout model for distributing space along a single row or column"],
      ["CSS Grid", "Two-dimensional CSS layout system of rows and columns"],
      ["Media query", "CSS rule that applies styles based on device characteristics like width"],
    ]),
    sub("javascript", "JavaScript", "Language fundamentals and asynchronous programming.", [
      ["Closure", "Function that retains access to variables from the scope where it was created"],
      ["Promise", "Object representing the eventual completion or failure of an asynchronous operation"],
      ["Event loop", "Mechanism that runs queued callbacks when the call stack is empty"],
    ]),
    sub("react", "React", "Component-based user interfaces.", [
      ["Component", "Reusable function that returns UI from props and state"],
      ["useState hook", "React hook that adds local state to a function component"],
      ["Virtual DOM", "In-memory representation of the UI that React diffs to apply minimal updates"],
    ]),
    sub("backend_apis", "Backend & REST APIs", "Servers, APIs and authentication.", [
      ["REST", "API style using HTTP methods on resources identified by URLs"],
      ["HTTP status 404", "Response code meaning the requested resource was not found"],
      ["JWT", "Signed JSON token used to transmit authentication claims"],
      ["CORS", "Browser mechanism controlling which origins may access a server's resources"],
    ]),
  ]),

  skill("machine_learning", "Machine Learning", "Supervised and unsupervised learning, model evaluation and neural networks.", { level: 3, deps: ["probability_statistics", "python_programming", "engineering_mathematics"], book: "Aurélien Géron — Hands-On Machine Learning" }, [
    sub("supervised", "Supervised Learning", "Regression and classification from labelled data.", [
      ["Linear regression", "Model predicting a continuous target as a weighted sum of features"],
      ["Logistic regression", "Classification model outputting class probability through a sigmoid function"],
      ["Decision tree", "Model that splits data with feature-based rules arranged as a tree"],
      ["Random forest", "Ensemble of decision trees trained on bootstrap samples with random feature subsets"],
    ]),
    sub("unsupervised", "Unsupervised Learning", "Finding structure without labels.", [
      ["k-means clustering", "Algorithm partitioning data into k clusters by minimising distance to centroids"],
      ["PCA", "Principal component analysis, projecting data onto directions of maximum variance"],
      ["Anomaly detection", "Identifying data points that differ markedly from the majority"],
    ]),
    sub("model_evaluation", "Model Evaluation", "Measuring and improving generalisation.", [
      ["Overfitting", "Model fits training noise and performs poorly on unseen data"],
      ["Cross-validation", "Repeatedly training and testing on different splits to estimate generalisation"],
      ["Precision", "Fraction of predicted positives that are actually positive"],
      ["Recall", "Fraction of actual positives that the model correctly identifies"],
      ["Regularisation", "Penalty on model complexity, such as L1 or L2, that reduces overfitting"],
    ]),
    sub("deep_learning", "Neural Networks & Deep Learning", "Multi-layer networks and their training.", [
      ["Backpropagation", "Algorithm computing gradients of the loss with respect to weights via the chain rule"],
      ["Activation function", "Non-linear function such as ReLU applied to a neuron's weighted input"],
      ["Convolutional neural network", "Network using learned filters, well suited to images"],
      ["Gradient descent", "Optimisation that updates parameters in the direction of the negative gradient"],
    ]),
  ]),

  skill("data_analytics", "Data Analytics & Visualisation", "Cleaning, exploring and communicating data with dashboards and charts.", { level: 2, category: "tools", deps: ["probability_statistics", "python_programming"], book: "Cole Nussbaumer Knaflic — Storytelling with Data" }, [
    sub("data_cleaning", "Data Cleaning", "Preparing raw data for analysis.", [
      ["Imputation", "Filling missing values with estimates such as the mean, median or a model prediction"],
      ["Outlier", "Observation far from the bulk of the data that may be error or genuine extreme"],
      ["Tidy data", "Format where each variable is a column, each observation a row"],
    ]),
    sub("eda", "Exploratory Data Analysis", "Summarising and exploring datasets.", [
      ["Box plot", "Chart showing median, quartiles and outliers of a distribution"],
      ["Correlation coefficient", "Measure from −1 to 1 of the linear relationship between two variables"],
      ["Histogram", "Bar chart of the frequency of values falling into bins"],
    ]),
    sub("dashboards", "Dashboards & BI", "Communicating metrics to decision makers.", [
      ["KPI", "Key performance indicator, a metric tied to a business objective"],
      ["Drill-down", "Navigating from summary data to more detailed levels"],
      ["Data-ink ratio", "Proportion of a chart's ink that presents actual data rather than decoration"],
    ]),
  ]),

  skill("cloud_computing", "Cloud Computing & DevOps", "Cloud service models, containers, CI/CD and infrastructure as code.", { level: 4, category: "elective", deps: ["operating_systems", "computer_networks"], book: "Kief Morris — Infrastructure as Code" }, [
    sub("cloud_models", "Cloud Service Models", "IaaS, PaaS, SaaS and deployment models.", [
      ["IaaS", "Cloud model providing virtual machines, storage and networks on demand"],
      ["PaaS", "Cloud model providing a managed platform for deploying applications"],
      ["Serverless", "Model where the provider runs code on demand and bills per execution"],
    ]),
    sub("containers", "Containers & Orchestration", "Docker and Kubernetes.", [
      ["Container", "Lightweight isolated runtime packaging an application with its dependencies"],
      ["Docker image", "Read-only template from which containers are created"],
      ["Kubernetes pod", "Smallest deployable unit in Kubernetes, one or more co-located containers"],
    ]),
    sub("devops", "CI/CD & Infrastructure as Code", "Automating delivery and infrastructure.", [
      ["CI/CD pipeline", "Automated sequence that builds, tests and deploys code changes"],
      ["Infrastructure as code", "Managing infrastructure through versioned configuration files such as Terraform"],
      ["Blue-green deployment", "Release strategy switching traffic between two identical environments"],
    ]),
  ]),
];
