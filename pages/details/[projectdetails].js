import React from 'react'
import { useRouter } from 'next/router';

function productDetails() {

    const router = useRouter();
    const { key } = router.query;

    return (
        <div>
            <h1>Detalhes do Projeto</h1>
        </div>
    )
}

export default productDetails