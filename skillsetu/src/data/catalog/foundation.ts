import { skill, sub } from "./dsl";

export const foundationSkills = [
  skill("engineering_mathematics", "Engineering Mathematics", "Calculus, linear algebra, differential equations and transforms — the language every engineering branch is written in.", { level: 1, category: "foundation", book: "Erwin Kreyszig — Advanced Engineering Mathematics" }, [
    sub("calculus", "Calculus", "Limits, derivatives, integrals and their use for rates, areas and optimisation.", [
      ["Derivative", "Instantaneous rate of change of a function, the slope of its tangent line"],
      ["Definite integral", "Accumulated quantity such as area under a curve between two limits"],
      ["Partial derivative", "Rate of change of a multivariable function with respect to one variable while others are held constant"],
      ["Taylor series", "Representation of a function as an infinite sum of terms built from its derivatives at a single point"],
    ], [
      ["What is d/dx (x³)?", "3x²", ["x²", "3x³", "x⁴/4"], "Power rule: d/dx xⁿ = n·xⁿ⁻¹.", 1],
    ]),
    sub("linear_algebra", "Linear Algebra", "Matrices, vector spaces, eigenvalues and solving systems of linear equations.", [
      ["Eigenvalue", "Scalar λ for which A·v = λ·v has a non-zero solution vector v"],
      ["Rank of a matrix", "Maximum number of linearly independent rows or columns"],
      ["Determinant", "Scalar from a square matrix that is zero exactly when the matrix is singular"],
      ["Gaussian elimination", "Row-reduction method that transforms a linear system into upper-triangular form for back-substitution"],
    ], [
      ["A square matrix has determinant 0. What does this imply?", "It has no inverse", ["All its eigenvalues are 1", "It is the identity matrix", "It is symmetric"], "A zero determinant means the matrix is singular, so no inverse exists."],
    ]),
    sub("differential_equations", "Differential Equations", "Ordinary and partial differential equations that model dynamic engineering systems.", [
      ["Order of an ODE", "Highest derivative that appears in the differential equation"],
      ["Linear ODE", "Differential equation in which the unknown function and its derivatives appear only to the first power and are not multiplied together"],
      ["Initial value problem", "Differential equation together with conditions specified at a single starting point"],
      ["Integrating factor", "Multiplier that turns a first-order linear ODE into an exact derivative so it can be integrated directly"],
    ]),
    sub("transforms", "Laplace & Fourier Transforms", "Transform methods that convert differential equations and signals into easier algebraic forms.", [
      ["Laplace transform", "Integral transform that converts a time-domain function into the complex s-domain, turning ODEs into algebra"],
      ["Fourier series", "Representation of a periodic function as a sum of sines and cosines"],
      ["Fourier transform", "Decomposition of a signal into its continuous spectrum of frequencies"],
      ["Convolution", "Operation combining two functions that corresponds to multiplication in the transform domain"],
    ]),
  ]),

  skill("numerical_methods", "Numerical Methods", "Algorithms that approximate solutions to equations, integrals and differential equations on a computer.", { level: 2, category: "foundation", deps: ["engineering_mathematics"], book: "Chapra & Canale — Numerical Methods for Engineers" }, [
    sub("root_finding", "Root Finding", "Iterative techniques for solving nonlinear equations f(x) = 0.", [
      ["Bisection method", "Bracketing method that repeatedly halves an interval in which the function changes sign"],
      ["Newton-Raphson method", "Open method that uses the tangent line x₁ = x₀ − f(x₀)/f′(x₀) and converges quadratically near a root"],
      ["Secant method", "Root-finding method that approximates the derivative using two previous iterates"],
    ], [
      ["Which root-finding method is guaranteed to converge if the initial interval brackets a root?", "Bisection", ["Newton-Raphson", "Secant", "Fixed-point iteration"], "Bisection always keeps the root bracketed, so it cannot diverge — it is just slow (linear convergence)."],
    ]),
    sub("numerical_integration", "Numerical Integration", "Quadrature rules that approximate definite integrals from sampled points.", [
      ["Trapezoidal rule", "Approximates the area under a curve by joining successive points with straight lines"],
      ["Simpson's 1/3 rule", "Fits parabolas through pairs of intervals and needs an even number of intervals"],
      ["Gaussian quadrature", "Chooses optimal sample points and weights to integrate polynomials exactly with few evaluations"],
    ]),
    sub("ode_solvers", "ODE Solvers", "Step-by-step methods for integrating initial value problems.", [
      ["Euler's method", "First-order explicit method that advances the solution using the slope at the start of each step"],
      ["Runge-Kutta 4th order", "Method that averages four slope estimates per step to achieve fourth-order accuracy"],
      ["Stiff system", "ODE system with widely separated time scales that forces explicit methods to take tiny steps"],
    ]),
    sub("linear_systems_numerical", "Solving Linear Systems", "Direct and iterative methods for large systems of linear equations.", [
      ["LU decomposition", "Factorisation of a matrix into lower and upper triangular matrices for efficient repeated solves"],
      ["Gauss-Seidel method", "Iterative method that uses the newest available values of unknowns within each sweep"],
      ["Diagonal dominance", "Matrix property where each diagonal element exceeds the sum of the other elements in its row, ensuring iterative convergence"],
    ]),
  ]),

  skill("probability_statistics", "Probability & Statistics", "Probability, distributions, inference and regression for data-driven engineering decisions.", { level: 1, category: "foundation", deps: ["engineering_mathematics"], book: "Montgomery & Runger — Applied Statistics and Probability for Engineers" }, [
    sub("probability_basics", "Probability Basics", "Events, conditional probability and Bayes' theorem.", [
      ["Conditional probability", "Probability of an event given that another event has occurred, P(A|B) = P(A∩B)/P(B)"],
      ["Bayes' theorem", "Rule for updating the probability of a hypothesis using new evidence"],
      ["Independent events", "Events for which the occurrence of one does not change the probability of the other"],
    ]),
    sub("distributions", "Probability Distributions", "Common discrete and continuous distributions and when to use them.", [
      ["Normal distribution", "Symmetric bell-shaped continuous distribution fully described by its mean and standard deviation"],
      ["Poisson distribution", "Discrete distribution for the number of events occurring in a fixed interval at a constant average rate"],
      ["Binomial distribution", "Discrete distribution for the number of successes in a fixed number of independent yes/no trials"],
      ["Central limit theorem", "Result that sample means tend toward a normal distribution as sample size grows, regardless of the population shape"],
    ], [
      ["For a normal distribution, roughly what fraction of data lies within ±1 standard deviation of the mean?", "68%", ["50%", "95%", "99.7%"], "The 68–95–99.7 rule: ±1σ ≈ 68%, ±2σ ≈ 95%, ±3σ ≈ 99.7%.", 1],
    ]),
    sub("hypothesis_testing", "Hypothesis Testing", "Inference about populations from samples using significance tests.", [
      ["p-value", "Probability of observing data at least as extreme as the sample if the null hypothesis were true"],
      ["Type I error", "Rejecting a null hypothesis that is actually true (false positive)"],
      ["Type II error", "Failing to reject a null hypothesis that is actually false (false negative)"],
      ["Confidence interval", "Range of values that, under repeated sampling, contains the true parameter a stated percentage of the time"],
    ]),
    sub("regression", "Regression Analysis", "Fitting models to data and judging how well they explain the variation.", [
      ["Least squares", "Fitting method that minimises the sum of squared residuals between observed and predicted values"],
      ["Coefficient of determination", "R², the fraction of variance in the response explained by the regression model"],
      ["Residual", "Difference between an observed value and the value predicted by the model"],
    ]),
  ]),

  skill("python_programming", "Python Programming", "Core Python plus the scientific stack (NumPy, pandas, Matplotlib) used for engineering computation and data work.", { level: 1, category: "tools", book: "Allen B. Downey — Think Python" }, [
    sub("python_basics", "Python Basics", "Variables, types, control flow, functions and data structures.", [
      ["List", "Ordered, mutable sequence written with square brackets"],
      ["Tuple", "Ordered, immutable sequence written with parentheses"],
      ["Dictionary", "Mutable mapping of unique keys to values written with curly braces"],
      ["List comprehension", "Concise expression that builds a list by applying an expression to each item of an iterable"],
    ], [
      ["What does len([1, [2, 3], 4]) return?", "3", ["4", "2", "An error"], "The nested list counts as a single element, so the outer list has 3 items.", 1],
    ]),
    sub("numpy", "NumPy", "Vectorised numerical arrays and linear algebra.", [
      ["ndarray", "NumPy's homogeneous, fixed-type multidimensional array object"],
      ["Broadcasting", "Rules that let NumPy apply operations to arrays of different but compatible shapes without copying data"],
      ["Vectorisation", "Replacing explicit Python loops with whole-array operations executed in compiled code"],
    ]),
    sub("pandas", "pandas", "Tabular data loading, cleaning, grouping and joining.", [
      ["DataFrame", "Two-dimensional labelled table of columns that may hold different data types"],
      ["groupby", "Split-apply-combine operation that aggregates rows sharing the same key"],
      ["merge", "Database-style join of two DataFrames on one or more key columns"],
    ]),
    sub("matplotlib", "Plotting with Matplotlib", "Building clear engineering plots from data.", [
      ["Figure", "Top-level Matplotlib container that holds one or more axes"],
      ["Axes", "Single plot area with its own coordinate system, ticks and labels"],
      ["Log-scale axis", "Axis whose spacing is proportional to the logarithm of the value, useful for data spanning orders of magnitude"],
    ]),
  ]),

  skill("engineering_mechanics", "Engineering Mechanics", "Statics and dynamics of particles and rigid bodies — forces, moments, motion and energy.", { level: 1, category: "foundation", deps: ["engineering_mathematics"], book: "Beer & Johnston — Vector Mechanics for Engineers" }, [
    sub("statics", "Statics", "Equilibrium of particles and rigid bodies under applied forces.", [
      ["Free body diagram", "Sketch isolating a body and showing every external force and moment acting on it"],
      ["Moment of a force", "Tendency of a force to rotate a body about a point, equal to force times perpendicular distance"],
      ["Equilibrium", "State in which the vector sums of all forces and all moments on a body are zero"],
    ]),
    sub("friction", "Friction", "Dry friction, angle of repose and impending motion.", [
      ["Coefficient of static friction", "Ratio of maximum friction force to normal force just before sliding begins"],
      ["Angle of repose", "Steepest slope on which a body rests without sliding, whose tangent equals the coefficient of static friction"],
      ["Kinetic friction", "Friction force opposing relative motion once sliding has started, usually smaller than the static limit"],
    ]),
    sub("centroid_inertia", "Centroids & Moment of Inertia", "Geometric properties of areas and bodies used in design.", [
      ["Centroid", "Geometric centre of an area or volume where it would balance if of uniform density"],
      ["Area moment of inertia", "Second moment of area that measures a cross-section's resistance to bending"],
      ["Parallel axis theorem", "I = I_c + A·d², shifting a moment of inertia from a centroidal axis to a parallel axis"],
    ]),
    sub("dynamics", "Dynamics", "Kinematics and kinetics of particles and rigid bodies.", [
      ["Newton's second law", "The net force on a body equals its mass times its acceleration"],
      ["Work-energy principle", "Work done by all forces on a body equals the change in its kinetic energy"],
      ["Impulse-momentum principle", "Impulse of a force over a time interval equals the change in linear momentum"],
    ]),
  ]),
];
