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
      "title": "Create a new account"
    }
  },
  "common": {

  },
  "simulations": {
    "sidebar": {
      "notFoundMessage": "No simulations found",
      "scroll": {
        "nextPageLabel": " • Scroll for more",
        "totalSimulations": "{{count}} simulations" | "{{count}} simulation" | "{{count}} simulations" | "{{count}} simulations"
      },
      "search": {
        "placeholder": "Search your simulations..."
      }
    }
  }
}

export default Resources;
