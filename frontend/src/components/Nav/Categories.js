import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Category from "./Category";

const Categories = () => {

    const [categories, setCategories] = useState([]);

    async function fetchCategories() {
        const response = await fetch("http://localhost:8000/api/categories");
        if (response.ok) {
            const json = await response.json();
            setCategories(json);
        } else {
            throw new Error("error loading categories.");
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            {/* This is the first category in the dropdown, which is always the home category.*/}
            <li><Link to="/">Home</Link></li>

            {/* These are the rest of the categories.*/}
            {categories.map(category => <Category key={category.id} category={category} />)}
        </>
    );
}

export default Categories
