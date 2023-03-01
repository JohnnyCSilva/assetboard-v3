import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { db } from '../../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc } from "firebase/firestore";
import { AuthContext } from '../../config/AuthContext';

const ProjectDetails = () => {

    const router = useRouter();
    const { key } = router.query;
    const { currentUser } = useContext(AuthContext);
    const [ projetos, setProjetos ] = useState([]);

    //get project details from db
    const getProjectDetails = async () => {
        const projetos = [];
        const q = query(collection(db, "projetos"), where("key", "==", key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            projetos.push({ ...doc.data(), id: doc.id });
        });
        setProjetos(projetos);
    }

    useEffect(() => {
        getProjectDetails();
        console.log(currentUser);
    }, []);
    
    return (
        <div>
            {currentUser}
        </div>
    );
};

export default ProjectDetails;
