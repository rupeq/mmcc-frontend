interface Resources {
  "authentication": {
    "signInForm": {
      "buttons": {
        "submit": "Sign in"
      },
      "description": "Enter your credentials below to login to your account",
      "fields": {
        "email": "Email",
        "password": "Password"
      },
      "newAccount": {
        "button": "Sign up",
        "label": "Don't have an account?"
      },
      "title": "Login to your account"
    },
    "signUpForm": {
      "buttons": {
        "submit": "Sign up"
      },
      "description": "Enter your credentials below to create your account",
      "fields": {
        "email": "Email",
        "password": "Password"
      },
      "haveAccount": {
        "button": "Sign in",
        "label": "Do you have an account?"
      },
      "title": "Create a new account"
    }
  },
  "common": {
    "errors": {
      "description": "We encountered an error while processing your request.",
      "goHome": "Go home",
      "title": "Something went wrong",
      "tryAgain": "Try again"
    },
    "loading": {
      "default": "Loading...",
      "pleaseWait": "Please wait"
    },
    "user": {
      "active": "Active",
      "activeAccount": "Active Account",
      "inactive": "Inactive",
      "signOut": "Sign out"
    }
  },
  "reports": {
    "aggregatedResults": {
      "description": "Results from {{count}} replication" | "Results from {{count}} replications",
      "title": "Aggregated Results"
    },
    "dataCollection": {
      "ganttChart": "Gantt Chart Data",
      "ganttEvents": "{{count}} service events recorded",
      "samplesCollected": "{{count}} samples collected",
      "serviceTimes": "Service Times",
      "temporalProfile": "Temporal Profile",
      "timeWindows": "{{count}} time windows analyzed"
    },
    "detailedMetrics": {
      "avgChannelUtilization": "Avg Channel Utilization",
      "rejectionProbability": "Rejection Probability",
      "throughput": "Throughput",
      "totalRequests": "Total Requests"
    },
    "individualReplications": {
      "description": "Detailed results for each simulation run",
      "replicationNumber": "Replication {{number}}",
      "summary": "{{processed}} processed, {{rejected}} rejected",
      "title": "Individual Replications"
    },
    "metrics": {
      "avgChannelUtilization": "Avg Channel Utilization",
      "confidenceInterval": "95% CI: [{{lowerBound}}, {{upperBound}}]",
      "processedRejected": "{{processed}} processed, {{rejected}} rejected",
      "rejectionProbability": "Rejection Probability",
      "throughput": "Throughput",
      "throughputUnit": "requests per time unit",
      "totalRequests": "Total Requests"
    },
    "reportView": {
      "errorMessage": "An error occurred while generating the report",
      "metadata": {
        "completed": "Completed",
        "created": "Created",
        "status": "Status"
      },
      "sweepNotSupported": "Sweep results are not yet supported in the UI"
    }
  },
  "simulations": {
    "createForm": {
      "buttons": {
        "create": "Create Simulation",
        "next": "Next",
        "previous": "Previous"
      },
      "fields": {
        "collectGanttData": "Collect Gantt Chart Data",
        "collectServiceTimes": "Collect Service Times",
        "collectTemporalProfile": "Collect Temporal Profile",
        "description": {
          "label": "Description (Optional)",
          "placeholder": "Testing loss system performance..."
        },
        "name": {
          "label": "Simulation Name",
          "placeholder": "System Test"
        },
        "numChannels": {
          "description": "The number of service channels available",
          "label": "Number of Channels"
        },
        "numReplications": {
          "description": "Run multiple times for statistical accuracy",
          "label": "Number of Replications"
        },
        "randomSeed": {
          "description": "Set a seed for reproducible results",
          "label": "Random Seed (Optional)",
          "placeholder": "Leave empty for random"
        },
        "simulationTime": {
          "description": "Total simulation time in time units",
          "label": "Simulation Time"
        }
      },
      "stepLabel": "Step {{current}} of {{total}}: {{title}}",
      "steps": {
        "advancedOptions": "Advanced Options",
        "basicInfo": "Basic Information",
        "distributions": "Distributions",
        "systemConfig": "System Configuration"
      },
      "title": "Create New Simulation"
    },
    "distributions": {
      "arrivalProcess": {
        "description": "Distribution governing customer arrivals",
        "label": "Distribution Type",
        "title": "Arrival Process"
      },
      "parameters": {
        "bandwidthDescription": "Leave empty for automatic bandwidth selection (Scott's rule)",
        "dataDescription": "Enter observed values (min 2, max 100,000). Supports comma, space, or newline separation.",
        "dataPlaceholder": "Enter values separated by commas, spaces, or newlines\nExample: 1.2, 1.5, 2.1, 1.8, 2.3",
        "dataPointsLoaded": "{{count}} data points loaded",
        "inverseTransform": "Inverse Transform (ECDF)",
        "kde": "Kernel Density Estimation",
        "kdeBandwidth": "KDE Bandwidth (Optional)",
        "lowerBound": "Lower Bound (a)",
        "mean": "Mean (μ)",
        "methodDescription": "Inverse Transform uses empirical CDF, KDE smooths the distribution",
        "observedData": "Observed Data",
        "rate": "Rate (λ)",
        "samplingMethod": "Sampling Method",
        "scale": "Scale (θ)",
        "scaleWeibull": "Scale (λ)",
        "shape": "Shape (k)",
        "standardDeviation": "Standard Deviation (σ)",
        "uploadFile": "Upload from file",
        "upperBound": "Upper Bound (b)"
      },
      "serviceProcess": {
        "description": "Distribution governing service times",
        "label": "Distribution Type",
        "title": "Service Process"
      },
      "types": {
        "empirical": "Empirical",
        "exponential": "Exponential",
        "gamma": "Gamma",
        "truncatedNormal": "Truncated Normal",
        "uniform": "Uniform",
        "weibull": "Weibull"
      }
    },
    "filters": {
      "allStatuses": "All Statuses",
      "applyFilters": "Apply Filters",
      "clearAll": "Clear All",
      "description": "Refine your simulation search",
      "includeArchived": "Include archived",
      "includeArchivedDescription": "Show archived simulations in results",
      "reportStatus": "Report Status",
      "status": "Status",
      "title": "Filters"
    },
    "menu": {
      "archived": "(Archived)",
      "clearFilters": "Clear filters",
      "deleteConfirm": "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.",
      "selectSimulation": "Select a simulation from the sidebar to view details"
    },
    "sidebar": {
      "createButton": "Create Simulation",
      "notFoundMessage": "No simulations found",
      "scroll": {
        "nextPageLabel": " • Scroll for more",
        "totalSimulations": "{{count}} simulations" | "{{count}} simulation" | "{{count}} simulations" | "{{count}} simulations"
      },
      "search": {
        "placeholder": "Search your simulations..."
      }
    },
    "simulationView": {
      "header": {
        "active": "Active",
        "archived": "Archived"
      },
      "sections": {
        "dataCollection": {
          "description": "Configuration for data collection during simulation",
          "ganttData": "Gantt Chart Data",
          "maxItems": "Max {{count}} items",
          "maxSamples": "Max {{count}} samples",
          "serviceTimes": "Service Times",
          "temporalProfile": "Temporal Profile",
          "title": "Data Collection Settings",
          "window": "Window: {{windowSize}}, Interval: {{interval}}"
        },
        "metadata": {
          "created": "Created",
          "updated": "Updated"
        },
        "reports": {
          "completed": "Completed:",
          "count": "{{count}} report" | "{{count}} reports",
          "createdAt": "Created {{date}}",
          "description": "Execution history and results for this configuration",
          "error": "Error:",
          "noReports": {
            "description": "This simulation configuration hasn't been executed yet. Reports will appear here once the simulation runs.",
            "title": "No Reports Yet"
          },
          "reportNumber": "Report #{{id}}",
          "resultsAvailable": "Results available",
          "title": "Simulation Reports"
        },
        "systemConfig": {
          "description": "Core parameters for the queueing system simulation",
          "randomSeed": "Random Seed",
          "replications": "Replications",
          "serviceChannels": "Service Channels",
          "simulationTime": "Simulation Time",
          "timeUnits": "time units",
          "title": "System Configuration"
        }
      },
      "statuses": {
        "cancelled": "Cancelled",
        "completed": "Completed",
        "failed": "Failed",
        "pending": "Pending",
        "running": "Running"
      }
    }
  }
}

export default Resources;
