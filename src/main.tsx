import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {PostHogProvider} from 'posthog-js/react'

const REACT_APP_PUBLIC_POSTHOG_HOST = import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST;
const REACT_APP_PUBLIC_POSTHOG_KEY = import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY;

const options = {
    api_host: REACT_APP_PUBLIC_POSTHOG_HOST,
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PostHogProvider
            apiKey={REACT_APP_PUBLIC_POSTHOG_KEY}
            options={options}
        >
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </PostHogProvider>
    </StrictMode>,
)