import axios from "axios";

export async function checkBackend() {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/health"
        );

        console.log("Backend response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Backend connection failed:", error);
        return null;
    }
}