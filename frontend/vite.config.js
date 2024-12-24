import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
    return {
        build: {
            outDir: "dist",
        },
        plugins: [react()],
        define: {
            "import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
    };
});
