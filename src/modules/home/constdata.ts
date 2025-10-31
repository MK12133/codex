export const PROJECT_TEMPLATES = [
  {
    emoji: "🎬",
    title: "Build a Netflix clone",
    prompt: `Build a fully responsive Netflix-style streaming interface using modern React patterns.Include a dynamic hero banner that automatically features trending content, categorized movie sections fetched from a mock or real API,and a modal for trailer previews. Implement search, dark mode, and loading skeletons for better UX.Use Zustand or Context for state management and lazy-load images for performance.`,
  },
  {
    emoji: "📦",
    title: "Build an admin dashboard",
    prompt: `Build an interactive admin dashboard with a collapsible sidebar, analytic widgets, line/bar chart visualizations using Recharts or Chart.js,and a data table supporting client-side sorting, filtering, and pagination.Use React Query (or TanStack Query) to manage data fetching from a mock API and apply consistent spacing, theming, and hover feedback for a polished enterprise UI.`,
  },
  {
    emoji: "📋",
    title: "Build a kanban board",
    prompt: `Create a fully interactive Kanban board using react-beautiful-dnd with smooth animations for drag-and-drop across columns. Allow users to create, update, and delete tasks dynamically, persist board state in localStorage, and support dark/light mode toggle.Implement a task search bar and color-coded priority levels for an enhanced productivity workflow.`,
  },
  {
    emoji: "🗂️",
    title: "Build a file manager",
    prompt: `Design a file manager interface featuring folder navigation, grid and list view toggles,file actions (rename, delete, duplicate), and breadcrumb navigation for hierarchy awareness.Use local state or React Context to simulate directory traversal and apply optimistic UI updates for instant feedback.`,
  },
  {
    emoji: "📺",
    title: "Build a YouTube clone",
    prompt: `Develop a responsive YouTube-style video platform with category-based video feeds, search functionality,and a modal video player with title, description, and related videos.Implement infinite scrolling, video duration overlays, and a watch history using localStorage.Focus on alignment, typography, and clean grid layout with accessible keyboard navigation.`,
  },
  {
    emoji: "🛍️",
    title: "Build a store page",
    prompt: `Build a modern e-commerce storefront with product filtering by category, price, and rating.Implement local cart functionality using Context API or Zustand,include quantity management, persistent cart storage, and checkout summary modal.Use responsive product cards with hover animations and a clean, modular component structure.`,
  },
  {
    emoji: "🏡",
    title: "Build an Airbnb clone",
    prompt: `Create a property listing platform with an advanced filter sidebar (price range, amenities, location),card-based grid of properties with lazy image loading, and a detail modal with gallery and map integration (mock coordinates).Use debounced search and optimistic updates to simulate real-time filtering, and apply smooth transitions for modals and page changes.`,
  },
  {
    emoji: "🎵",
    title: "Build a Spotify clone",
    prompt: `Build a Spotify-inspired music player interface with playlist navigation, album and track listing, and real-time playback controls.Use a global audio context to handle play, pause, next, and seek functionality.Add progress bar animations, active song highlighting, and keyboard shortcuts for playback.Ensure seamless layout balance, dark mode aesthetics, and responsive scaling across devices.`,
  },
] as const;
