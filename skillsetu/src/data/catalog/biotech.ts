import { skill, sub } from "./dsl";

export const biotechSkills = [
  skill("biochemistry", "Biochemistry", "Structure and function of biomolecules and the metabolic pathways that power cells.", { level: 1, book: "Lehninger — Principles of Biochemistry" }, [
    sub("biomolecules", "Biomolecules", "Proteins, carbohydrates, lipids and nucleic acids.", [
      ["Amino acid", "Monomer of proteins containing an amino group, a carboxyl group and a variable side chain"],
      ["Peptide bond", "Covalent amide bond linking the carboxyl group of one amino acid to the amino group of the next"],
      ["Tertiary structure", "Overall three-dimensional fold of a single polypeptide chain"],
      ["Glycosidic bond", "Covalent bond joining a carbohydrate to another molecule, linking sugars into polysaccharides"],
    ]),
    sub("metabolism", "Metabolism", "Energy-yielding and biosynthetic pathways.", [
      ["Glycolysis", "Cytosolic pathway converting one glucose into two pyruvate with a net gain of 2 ATP"],
      ["TCA cycle", "Mitochondrial cycle that oxidises acetyl-CoA to CO₂ and generates NADH and FADH₂"],
      ["Oxidative phosphorylation", "ATP synthesis driven by the proton gradient created by the electron transport chain"],
      ["Anabolism", "Set of metabolic pathways that build complex molecules from simpler ones using energy"],
    ]),
    sub("bioenergetics", "Bioenergetics", "Free energy and the role of ATP.", [
      ["ATP", "Adenosine triphosphate, the cell's main short-term energy currency"],
      ["Coupled reaction", "Unfavourable reaction driven forward by linking it to a strongly favourable one such as ATP hydrolysis"],
      ["Redox potential", "Tendency of a chemical species to acquire electrons and be reduced"],
    ]),
  ]),

  skill("microbiology", "Microbiology", "Microbial cells, growth, and the control of microorganisms in industrial processes.", { level: 1, book: "Prescott — Microbiology" }, [
    sub("microbial_cells", "Microbial Cell Structure", "Prokaryotic and eukaryotic microorganisms.", [
      ["Prokaryote", "Cell without a membrane-bound nucleus, such as bacteria and archaea"],
      ["Gram stain", "Differential stain separating bacteria by cell wall type into Gram-positive and Gram-negative"],
      ["Endospore", "Dormant, highly resistant structure formed by some bacteria to survive harsh conditions"],
    ]),
    sub("microbial_growth", "Microbial Growth", "Growth curves and kinetics.", [
      ["Lag phase", "Initial period in batch culture when cells adapt and do not yet divide rapidly"],
      ["Exponential phase", "Growth phase in which cell numbers double at a constant rate"],
      ["Doubling time", "Time required for a microbial population to double, ln2/μ"],
      ["Stationary phase", "Phase when growth rate equals death rate, often because nutrients run out"],
    ]),
    sub("sterilization", "Sterilization & Aseptic Technique", "Killing or excluding contaminating organisms.", [
      ["Autoclaving", "Sterilisation with saturated steam, commonly at 121 °C for about 15 minutes"],
      ["D-value", "Time at a given temperature needed to reduce a microbial population by 90%"],
      ["Aseptic technique", "Practices that prevent contamination of cultures, media and equipment"],
    ]),
  ]),

  skill("molecular_biology", "Molecular Biology & Genetic Engineering", "DNA, gene expression and the tools used to engineer organisms.", { level: 2, deps: ["biochemistry"], book: "Watson — Molecular Biology of the Gene" }, [
    sub("central_dogma", "Central Dogma", "DNA replication, transcription and translation.", [
      ["Transcription", "Synthesis of RNA from a DNA template by RNA polymerase"],
      ["Translation", "Synthesis of a polypeptide from mRNA at the ribosome"],
      ["Codon", "Three-nucleotide sequence of mRNA that specifies one amino acid or a stop signal"],
      ["Promoter", "DNA sequence where RNA polymerase binds to begin transcription"],
    ]),
    sub("recombinant_dna", "Recombinant DNA Technology", "Cloning genes into vectors and hosts.", [
      ["Restriction enzyme", "Endonuclease that cuts DNA at a specific recognition sequence"],
      ["Plasmid vector", "Small circular DNA molecule used to carry and replicate inserted genes in a host"],
      ["DNA ligase", "Enzyme that joins DNA fragments by forming phosphodiester bonds"],
      ["Selectable marker", "Gene, such as antibiotic resistance, that lets only transformed cells grow"],
    ]),
    sub("pcr_sequencing", "PCR & Sequencing", "Amplifying and reading DNA.", [
      ["PCR", "Polymerase chain reaction, cycles of denaturation, annealing and extension that amplify DNA exponentially"],
      ["Taq polymerase", "Heat-stable DNA polymerase from Thermus aquaticus used in PCR"],
      ["Next-generation sequencing", "Massively parallel sequencing of millions of DNA fragments at once"],
    ]),
    sub("gene_editing", "Genome Editing", "Precise modification of genomes.", [
      ["CRISPR-Cas9", "RNA-guided nuclease system that cuts DNA at a site matching its guide RNA"],
      ["Guide RNA", "Short RNA sequence that directs Cas9 to the target DNA site"],
      ["Homology-directed repair", "DNA repair pathway that uses a template to make precise edits after a cut"],
    ]),
  ]),

  skill("enzyme_kinetics", "Enzyme Engineering & Kinetics", "Kinetics, inhibition and industrial use of enzymes.", { level: 2, deps: ["biochemistry"], book: "Shuler & Kargi — Bioprocess Engineering: Basic Concepts" }, [
    sub("michaelis_menten", "Michaelis-Menten Kinetics", "Rate of enzyme-catalysed reactions.", [
      ["Michaelis constant", "K_m, the substrate concentration at which the reaction rate is half of V_max"],
      ["V_max", "Maximum reaction rate when the enzyme is fully saturated with substrate"],
      ["Lineweaver-Burk plot", "Double-reciprocal plot of 1/v versus 1/[S] used to estimate K_m and V_max"],
      ["Turnover number", "k_cat, the number of substrate molecules converted per enzyme site per unit time"],
    ], [
      ["When [S] = K_m, the reaction rate equals:", "V_max / 2", ["V_max", "2·V_max", "Zero"], "Substituting [S] = K_m into v = V_max[S]/(K_m+[S]) gives V_max/2.", 1],
    ]),
    sub("inhibition", "Enzyme Inhibition", "How inhibitors change apparent kinetics.", [
      ["Competitive inhibition", "Inhibitor competes for the active site, raising apparent K_m with V_max unchanged"],
      ["Non-competitive inhibition", "Inhibitor binds elsewhere, lowering V_max without changing K_m"],
      ["Substrate inhibition", "Rate decrease at very high substrate concentration"],
    ]),
    sub("immobilization", "Enzyme Immobilization", "Fixing enzymes for reuse in processes.", [
      ["Enzyme immobilization", "Attaching or entrapping enzymes on a support so they can be reused"],
      ["Entrapment", "Immobilization by enclosing enzymes within a gel or polymer matrix"],
      ["Diffusional limitation", "Reduction in observed rate because substrate cannot reach immobilized enzyme fast enough"],
    ]),
  ]),

  skill("bioreactor_design", "Bioprocess Engineering & Bioreactor Design", "Cell growth kinetics, sterilisation and scale-up of fermenters.", { level: 3, deps: ["microbiology", "enzyme_kinetics", "mass_transfer"], book: "Doran — Bioprocess Engineering Principles" }, [
    sub("growth_kinetics", "Cell Growth Kinetics", "Monod model and yield coefficients.", [
      ["Monod equation", "μ = μ_max·S/(K_s + S), relating specific growth rate to limiting substrate"],
      ["Yield coefficient", "Mass of cells or product formed per mass of substrate consumed"],
      ["Specific growth rate", "Rate of increase of biomass per unit biomass, μ = (1/X)·dX/dt"],
    ]),
    sub("operation_modes", "Bioreactor Operation Modes", "Batch, fed-batch and continuous culture.", [
      ["Fed-batch culture", "Operation where nutrients are added during the run but nothing is removed until the end"],
      ["Chemostat", "Continuous culture where the dilution rate sets the steady-state specific growth rate"],
      ["Washout", "Loss of cells from a chemostat when dilution rate exceeds the maximum growth rate"],
    ]),
    sub("oxygen_transfer", "Oxygen Transfer", "Supplying oxygen to aerobic cultures.", [
      ["kLa", "Volumetric oxygen mass transfer coefficient, combining film coefficient and interfacial area"],
      ["Oxygen uptake rate", "Rate at which cells consume dissolved oxygen per unit volume"],
      ["Sparger", "Device at the bottom of a fermenter that introduces gas as bubbles"],
    ]),
    sub("scale_up", "Scale-up", "Taking a bioprocess from lab to production.", [
      ["Constant P/V scale-up", "Scale-up criterion keeping power input per unit volume the same"],
      ["Tip speed", "Impeller tip velocity, which governs shear damage to cells"],
      ["Mixing time", "Time for a tracer to become uniformly distributed in a vessel"],
    ]),
  ]),

  skill("downstream_processing", "Downstream Processing", "Recovery and purification of biological products.", { level: 3, deps: ["bioreactor_design", "mass_transfer"], book: "Harrison et al. — Bioseparations Science and Engineering" }, [
    sub("cell_disruption", "Cell Disruption & Clarification", "Releasing intracellular products and removing solids.", [
      ["High-pressure homogenizer", "Device that breaks cells by forcing a suspension through a narrow valve at high pressure"],
      ["Bead mill", "Equipment that disrupts cells by agitation with small grinding beads"],
      ["Clarification", "Removal of cells and debris from broth, typically by centrifugation or filtration"],
    ]),
    sub("chromatography", "Chromatography", "High-resolution purification of proteins.", [
      ["Affinity chromatography", "Separation using a specific binding interaction, such as Protein A with antibodies"],
      ["Ion-exchange chromatography", "Separation based on the net charge of molecules at a given pH"],
      ["Size-exclusion chromatography", "Separation by molecular size, with large molecules eluting first"],
      ["Isoelectric point", "pH at which a protein carries no net charge"],
    ]),
    sub("membrane_separation", "Membrane Separations", "Filtration across semi-permeable membranes.", [
      ["Ultrafiltration", "Pressure-driven membrane process that retains macromolecules such as proteins"],
      ["Diafiltration", "Washing a retained product by adding buffer while permeate is removed"],
      ["Concentration polarization", "Build-up of retained solute at the membrane surface that reduces flux"],
    ]),
  ]),

  skill("metabolic_engineering", "Metabolic Engineering", "Redesigning cellular metabolism to overproduce valuable compounds.", { level: 4, category: "elective", deps: ["molecular_biology", "bioreactor_design"], book: "Stephanopoulos — Metabolic Engineering: Principles and Methodologies" }, [
    sub("flux_analysis", "Metabolic Flux Analysis", "Quantifying flows through metabolic networks.", [
      ["Flux balance analysis", "Linear-programming method that predicts steady-state fluxes by optimising an objective such as growth"],
      ["Stoichiometric matrix", "Matrix of coefficients linking each metabolite to each reaction in a network"],
      ["13C flux analysis", "Method that traces isotope-labelled carbon to measure intracellular fluxes"],
    ]),
    sub("pathway_engineering", "Pathway Engineering", "Building and optimising production pathways.", [
      ["Heterologous expression", "Expressing a gene in a host organism that does not naturally have it"],
      ["Rate-limiting step", "Slowest reaction in a pathway that controls the overall flux"],
      ["Knockout", "Deleting a gene to remove a competing pathway or by-product"],
    ]),
    sub("synthetic_biology", "Synthetic Biology", "Engineering standardised biological parts.", [
      ["Genetic circuit", "Designed network of genes and regulators that performs a logic or control function"],
      ["Ribosome binding site", "mRNA sequence controlling how efficiently translation initiates"],
      ["Chassis organism", "Well-characterised host, such as E. coli or yeast, used to carry engineered systems"],
    ]),
  ]),

  skill("bioinformatics", "Bioinformatics", "Computational analysis of sequences, structures and omics data.", { level: 3, category: "tools", deps: ["molecular_biology", "python_programming", "probability_statistics"], book: "Mount — Bioinformatics: Sequence and Genome Analysis" }, [
    sub("sequence_alignment", "Sequence Alignment", "Comparing DNA and protein sequences.", [
      ["Global alignment", "Alignment across the entire length of two sequences, as in Needleman-Wunsch"],
      ["Local alignment", "Alignment of the best-matching subregions of two sequences, as in Smith-Waterman"],
      ["BLAST", "Heuristic tool that rapidly searches databases for sequences similar to a query"],
      ["Substitution matrix", "Table of scores for replacing one residue with another, such as BLOSUM62"],
    ]),
    sub("phylogenetics", "Phylogenetics", "Inferring evolutionary relationships.", [
      ["Phylogenetic tree", "Branching diagram showing inferred evolutionary relationships among sequences or species"],
      ["Neighbor-joining", "Distance-based method that builds a tree by repeatedly joining the closest pair"],
      ["Bootstrap support", "Percentage of resampled datasets that recover a given branch of a tree"],
    ]),
    sub("genomics_omics", "Genomics & Omics", "Analysing high-throughput biological data.", [
      ["RNA-seq", "Sequencing-based measurement of gene expression across the transcriptome"],
      ["Differential expression", "Statistical identification of genes whose expression changes between conditions"],
      ["Genome assembly", "Reconstructing a genome sequence from many short overlapping reads"],
    ]),
    sub("structural_bioinformatics", "Structural Bioinformatics", "Predicting and analysing 3D structures.", [
      ["Protein Data Bank", "Public archive of experimentally determined 3D structures of biomolecules"],
      ["Homology modelling", "Predicting a protein structure using a related protein of known structure as a template"],
      ["Molecular docking", "Computational prediction of how a small molecule binds to a protein target"],
    ]),
  ]),
];
