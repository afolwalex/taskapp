
const Pagination = ({postPerPage, totalPost, paginate, currentPage}) => {

    const pages = []

    for(let i = 1; i <= Math.ceil(totalPost/postPerPage); i++ ){
        pages.push(i)
    }
    return (
        <nav className='d-flex justify-content-center'>
            {pages.length > 1 &&
                <ul className='pagination'>
                    {pages.map(number => (
                        <li className={`page-item ${currentPage === number ? 'active' : ''}`} key={number}>
                            <button onClick={() => paginate(number)} className='page-link'>{number}</button>
                        </li>
                    ))}
                </ul>
            }
        </nav>
    )
}

export default Pagination