import { useEffect, useState } from "react";
import Category from "./Category";

const Categories = (props) => {
    const [categories, setCategories] = useState([]);

    async function fetchCategories() {
        const response = await fetch("http://localhost:8000/api/categories");
        if (response.ok) {
            const json = await response.json();
            console.log(json);
            setCategories(json);
        } else {
            throw new Error("error loading categories.");
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        categories.map((category) => 
            <Category key={category.id} category={category} />
        )
    )
}

export default Categories
