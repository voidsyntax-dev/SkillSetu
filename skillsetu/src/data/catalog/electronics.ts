import { skill, sub } from "./dsl";

export const electronicsSkills = [
  skill("analog_electronics", "Analog Electronics", "Diodes, transistors, amplifiers and op-amp circuits.", { level: 2, deps: ["circuit_theory"], book: "Sedra & Smith — Microelectronic Circuits" }, [
    sub("diodes", "Diodes & Rectifiers", "PN junctions and their applications.", [
      ["PN junction", "Boundary between p-type and n-type semiconductor that conducts mainly in one direction"],
      ["Zener diode", "Diode designed to operate in reverse breakdown to hold a constant voltage"],
      ["Ripple factor", "Ratio of the AC component to the DC component in a rectifier output"],
    ]),
    sub("transistors", "BJTs & MOSFETs", "Transistor operation and biasing.", [
      ["Current gain β", "Ratio of collector current to base current in a BJT in the active region"],
      ["Threshold voltage", "Gate-source voltage at which a MOSFET channel begins to conduct"],
      ["Q-point", "DC operating point of a transistor set by its biasing network"],
      ["Saturation region (BJT)", "Region where both junctions are forward biased and the transistor acts as a closed switch"],
    ]),
    sub("amplifiers", "Amplifiers", "Small-signal and feedback amplifiers.", [
      ["Common emitter amplifier", "BJT amplifier configuration with high voltage gain and 180° phase inversion"],
      ["Negative feedback", "Returning part of the output out of phase to stabilise gain and widen bandwidth"],
      ["Bandwidth", "Range of frequencies over which gain stays within 3 dB of its mid-band value"],
    ]),
    sub("op_amps", "Operational Amplifiers", "Ideal op-amp circuits.", [
      ["Virtual short", "In a negative-feedback op-amp circuit, the two inputs are at nearly the same voltage"],
      ["Inverting amplifier", "Op-amp circuit with gain −R_f/R_in"],
      ["Slew rate", "Maximum rate of change of an op-amp's output voltage"],
      ["CMRR", "Common-mode rejection ratio, ability to reject signals common to both inputs"],
    ], [
      ["An inverting amplifier has R_f = 100 kΩ and R_in = 10 kΩ. Its voltage gain is:", "−10", ["+10", "−11", "+11"], "Inverting gain = −R_f/R_in = −100k/10k = −10.", 1],
    ]),
  ]),

  skill("digital_electronics", "Digital Electronics", "Number systems, logic design, sequential circuits and memories.", { level: 2, deps: ["circuit_theory"], book: "M. Morris Mano — Digital Design" }, [
    sub("boolean_logic", "Boolean Algebra & Logic Gates", "Logic functions and minimisation.", [
      ["Karnaugh map", "Grid-based method for minimising Boolean expressions"],
      ["Universal gate", "Gate such as NAND or NOR from which any logic function can be built"],
      ["De Morgan's theorem", "The complement of a product equals the sum of complements, and vice versa"],
    ]),
    sub("combinational", "Combinational Circuits", "Circuits whose outputs depend only on current inputs.", [
      ["Multiplexer", "Circuit that selects one of several inputs to send to a single output"],
      ["Decoder", "Circuit that activates one of 2ⁿ outputs based on an n-bit input"],
      ["Full adder", "Circuit adding two bits plus a carry-in to give sum and carry-out"],
    ]),
    sub("sequential", "Sequential Circuits", "Flip-flops, counters and state machines.", [
      ["Flip-flop", "Edge-triggered one-bit memory element"],
      ["Finite state machine", "Sequential circuit model with states, transitions and outputs"],
      ["Setup time", "Minimum time data must be stable before the clock edge"],
      ["Ripple counter", "Asynchronous counter where each flip-flop is clocked by the previous one"],
    ]),
    sub("number_systems", "Number Systems & Codes", "Binary arithmetic and codes.", [
      ["Two's complement", "Signed binary representation formed by inverting all bits and adding one"],
      ["Gray code", "Binary sequence in which successive values differ by only one bit"],
      ["Hexadecimal", "Base-16 number system using digits 0–9 and A–F"],
    ], [
      ["What is the decimal value of binary 1011?", "11", ["13", "9", "10"], "1011₂ = 8 + 0 + 2 + 1 = 11.", 1],
    ]),
  ]),

  skill("signals_systems", "Signals & Systems", "Continuous and discrete signals, LTI systems, transforms and sampling.", { level: 2, deps: ["engineering_mathematics"], book: "Oppenheim & Willsky — Signals and Systems" }, [
    sub("lti_systems", "LTI Systems", "Linearity, time invariance and convolution.", [
      ["LTI system", "System that is both linear and time-invariant, fully described by its impulse response"],
      ["Impulse response", "Output of a system when the input is a unit impulse"],
      ["Causal system", "System whose output depends only on present and past inputs"],
      ["BIBO stability", "Every bounded input produces a bounded output"],
    ]),
    sub("sampling", "Sampling", "Converting continuous signals to discrete ones.", [
      ["Nyquist rate", "Minimum sampling rate, twice the highest signal frequency, needed to avoid aliasing"],
      ["Aliasing", "Distortion where high frequencies appear as lower ones due to undersampling"],
      ["Anti-aliasing filter", "Low-pass filter applied before sampling to remove frequencies above half the sample rate"],
    ], [
      ["A signal's highest frequency is 4 kHz. The minimum sampling rate to avoid aliasing is:", "8 kHz", ["4 kHz", "2 kHz", "16 kHz"], "Nyquist rate = 2 × f_max = 8 kHz.", 1],
    ]),
    sub("z_transform", "Z-Transform & DFT", "Discrete-time transforms.", [
      ["Z-transform", "Transform converting a discrete-time sequence into a complex-frequency function"],
      ["Region of convergence", "Set of z values for which a Z-transform sum converges"],
      ["FFT", "Fast Fourier transform, an O(N log N) algorithm for computing the DFT"],
    ]),
    sub("digital_filters", "Digital Filters", "FIR and IIR filter design.", [
      ["FIR filter", "Filter with finite impulse response, always stable and able to have linear phase"],
      ["IIR filter", "Recursive filter with infinite impulse response, efficient but possibly unstable"],
      ["Window method", "FIR design technique truncating an ideal impulse response with a window function"],
    ]),
  ]),

  skill("communication_systems", "Communication Systems", "Analog and digital modulation, noise and information theory.", { level: 3, deps: ["signals_systems", "probability_statistics"], book: "Simon Haykin — Communication Systems" }, [
    sub("analog_modulation", "Analog Modulation", "AM, FM and PM.", [
      ["Amplitude modulation", "Varying a carrier's amplitude in proportion to the message signal"],
      ["Frequency modulation", "Varying a carrier's instantaneous frequency in proportion to the message"],
      ["Carson's rule", "FM bandwidth ≈ 2(Δf + f_m)"],
    ]),
    sub("digital_modulation", "Digital Modulation", "Keying schemes and constellation diagrams.", [
      ["QPSK", "Phase shift keying with four phases carrying two bits per symbol"],
      ["QAM", "Modulation varying both amplitude and phase to carry many bits per symbol"],
      ["Bit error rate", "Fraction of received bits that are in error"],
    ]),
    sub("information_theory", "Information Theory", "Entropy, capacity and coding.", [
      ["Shannon capacity", "C = B·log₂(1 + SNR), maximum error-free data rate of a channel"],
      ["Source entropy", "Average information content per symbol of a source"],
      ["Error-correcting code", "Code that adds redundancy so the receiver can detect and fix errors"],
    ]),
    sub("wireless", "Wireless & Mobile Communication", "Cellular systems and propagation.", [
      ["Multipath fading", "Signal fluctuation caused by copies arriving over different paths"],
      ["OFDM", "Multicarrier scheme splitting data over many orthogonal subcarriers, used in 4G/5G and Wi-Fi"],
      ["Frequency reuse", "Using the same frequencies in separated cells to increase capacity"],
    ]),
  ]),

  skill("electromagnetics", "Electromagnetic Theory", "Maxwell's equations, wave propagation, transmission lines and antennas.", { level: 2, deps: ["engineering_mathematics"], book: "Sadiku — Elements of Electromagnetics" }, [
    sub("maxwell", "Maxwell's Equations", "The laws of electromagnetism.", [
      ["Gauss's law", "Net electric flux out of a closed surface equals enclosed charge divided by permittivity"],
      ["Faraday's law", "A changing magnetic flux induces an electromotive force"],
      ["Displacement current", "Term ε·∂E/∂t added by Maxwell so that Ampère's law holds for time-varying fields"],
    ]),
    sub("em_waves", "EM Wave Propagation", "Plane waves in different media.", [
      ["Skin depth", "Depth at which a wave's amplitude in a conductor falls to 1/e of its surface value"],
      ["Poynting vector", "Vector giving the power flow per unit area of an electromagnetic wave"],
      ["Intrinsic impedance", "Ratio of electric to magnetic field magnitudes for a wave in a medium (≈377 Ω in free space)"],
    ]),
    sub("transmission_lines_rf", "Transmission Lines & Antennas", "Guided waves and radiation.", [
      ["Characteristic impedance", "Ratio of voltage to current for a wave travelling on an infinitely long line"],
      ["VSWR", "Voltage standing wave ratio, indicating impedance mismatch on a line"],
      ["Antenna gain", "Directivity of an antenna combined with its efficiency"],
      ["Smith chart", "Graphical tool for impedance matching and transmission line calculations"],
    ]),
  ]),

  skill("embedded_systems", "Microprocessors & Embedded Systems", "Microcontroller architecture, interfacing and real-time firmware.", { level: 3, deps: ["digital_electronics", "programming_fundamentals"], book: "Mazidi — The 8051 Microcontroller and Embedded Systems" }, [
    sub("architecture", "Processor Architecture", "Microprocessor and microcontroller internals.", [
      ["Harvard architecture", "Architecture with separate memories and buses for instructions and data"],
      ["Register", "Small, fast storage location inside the CPU"],
      ["Instruction pipeline", "Overlapping the fetch, decode and execute stages of successive instructions"],
    ]),
    sub("interfacing", "Peripherals & Interfacing", "Communicating with sensors and devices.", [
      ["I2C", "Two-wire synchronous serial bus with addressable devices"],
      ["SPI", "Four-wire full-duplex synchronous serial interface with a master and slaves"],
      ["UART", "Asynchronous serial communication using start and stop bits"],
      ["ADC resolution", "Number of bits an analog-to-digital converter uses to represent a sample"],
    ]),
    sub("interrupts_rtos", "Interrupts & RTOS", "Responding to events in real time.", [
      ["Interrupt service routine", "Function executed automatically when a specific interrupt occurs"],
      ["RTOS", "Real-time operating system that schedules tasks with deterministic timing"],
      ["Watchdog timer", "Timer that resets the system if software fails to refresh it in time"],
    ]),
  ]),

  skill("vlsi_design", "VLSI Design", "CMOS logic, HDL-based design and the chip design flow.", { level: 4, category: "elective", deps: ["digital_electronics", "analog_electronics"], book: "Weste & Harris — CMOS VLSI Design" }, [
    sub("cmos", "CMOS Logic", "Building gates from complementary transistors.", [
      ["CMOS inverter", "Pair of PMOS and NMOS transistors that draws almost no static current"],
      ["Dynamic power", "Power consumed charging and discharging capacitances, ∝ C·V²·f"],
      ["Propagation delay", "Time between an input change and the resulting output change of a gate"],
    ]),
    sub("hdl", "Verilog / VHDL", "Describing hardware in code.", [
      ["RTL", "Register-transfer level description of data flow between registers"],
      ["Blocking assignment", "Verilog '=' assignment executed in order within a procedural block"],
      ["Testbench", "HDL code that applies stimulus to a design and checks its outputs in simulation"],
    ]),
    sub("design_flow", "Chip Design Flow", "From specification to tape-out.", [
      ["Logic synthesis", "Converting RTL into a gate-level netlist for a target library"],
      ["Static timing analysis", "Checking all timing paths meet constraints without simulation"],
      ["Place and route", "Physically positioning cells and wiring their connections on the die"],
    ]),
  ]),
];
