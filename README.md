## Getting Started

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Worklenz/worklenz-react.git

### 1. `/api`
This folder contains all the API service files used to interact with external services. It is organized by feature. For example, `authApi.ts` handles all authentication-related API calls, while `projectApi.ts` handles calls related to project management.

### 2. `/app`
This folder holds the configuration of the Redux store. It includes:
- `store.ts`: The Redux store setup.
- `hooks.ts`: Custom hooks like `useAppSelector` and `useAppDispatch` to simplify the use of Redux in components.
- `rootReducer.ts`: Combines all feature reducers into one root reducer.

### 3. `/components`
This folder contains reusable UI components that can be shared across different parts of the application, such as buttons, input fields, and loading spinners.

### 4. `/features`
A feature-based folder structure is used here, where each feature (e.g., authentication, projects, reporting) has its own folder. Inside each folder, you'll find:
- `Slice.ts`: The Redux slice for that feature, including its reducer and actions.
- `Actions.ts`: Any additional actions related to the feature.
- `Selectors.ts`: Selectors that extract specific parts of the feature's state.

This separation ensures that each feature is self-contained and modular.

### 5. `/layouts`
This folder contains layout components for different sections of the application:
- `AuthLayout.tsx`: Used for pages like login, signup, and forgot password.
- `NonAuthLayout.tsx`: Used for non-authenticated areas.
- `MainLayout.tsx`: Used for authenticated pages like the dashboard, projects, and settings.

### 6. `/pages`
Each folder in `pages` corresponds to a different section or feature of the app. For example, the `auth` folder contains pages like `Login.tsx` and `Signup.tsx`, while the `projects` folder contains `ProjectList.tsx` and `ProjectDetail.tsx`.

### 7. `/routes`
This folder contains the routing logic for the application. It includes:
- `AuthRoutes.tsx`: Routes for authenticated users.
- `NonAuthRoutes.tsx`: Routes for non-authenticated users.
- `PrivateRoute.tsx`: A higher-order component (HOC) that protects routes and ensures only authenticated users can access them.

### 8. `/styles`
Global styles or feature-specific styles are stored in this folder. You can have a `globals.css` file for common styles used across the app, or feature-specific stylesheets.

### 9. `/utils`
This folder contains utility functions and helper methods that are used across the app. For example, common constants and helper functions for manipulating data.

### 10. `/types`
TypeScript interfaces and types used in the application are stored here. Keeping types organized by feature ensures better type safety and easy-to-understand type definitions.

### 11. `/assets`
This folder is used for static assets such as images, fonts, and icons.

### Entry Files
- `index.tsx`: This is the entry point of the React app, where the root component is rendered.
- `App.tsx`: The main component that contains the layout and routes for the application.

