import React, {useEffect, useState} from 'react'
import {AiOutlinePlus, AiOutlineSearch} from 'react-icons/ai'
import Task from './components/Task'
import AddTask from './components/AddTask'
import { Modal } from 'reactstrap'
import firebaseDB from './firebase'
import Pagination from './components/Pagination'

const App = () => {

    const tags = [
        {id: 1, name: 'Custom task'},
        {id: 2, name: 'Marketing & Sales'},
        {id: 3, name: 'Integrations'},
        {id: 4, name: 'Optimization'},
        {id: 5, name: 'Deployment'},
        {id: 6, name: 'Testing'}
    ]

    const priceRange = [
        {id: 1, name: 'Less than 100'},
        {id: 2, name: 'N100 - N300'},
        {id: 3, name: 'N301 - N900'},
        {id: 4, name: 'Above N900'},
    ]

    let filteredTags = []

    const [openModal, setOpenModal] = useState(false)
    const [open, setOpen] = useState(false)
    const [getTask, setGetTask] = useState([])
  
    const [selectSort, setSelectSort] = useState('')
    const [sortAlphabet, setSortAlphabet] = useState(false)
    const [sortPrice, setSortPrice] = useState(false)
    const [ascend, setAscend] = useState(false)
    const [descend, setDscend] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage] = useState(6)

    // Get Current Posts
    const indexOfLastPost = currentPage * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage
    const currentPosts = getTask.slice(indexOfFirstPost, indexOfLastPost)

    useEffect(() => {

        // Sorting..

        if(sortAlphabet && !ascend ){
            getTask.sort((a, b) => a.name.localeCompare(b.name))
            setSortAlphabet(false)
        }
        if(sortAlphabet && ascend){
            getTask.sort((a, b) => b.name.localeCompare(a.name))
            setSortAlphabet(false)
        }
        if(sortPrice && !descend){
            getTask.sort((a, b) => a.price - b.price)
            setSortPrice(false)
        }
        if(sortPrice && descend){
            getTask.sort((a, b) => b.price - a.price)
            setSortPrice(false)
        }

    }, [getTask, sortAlphabet, ascend, sortPrice, descend])


    useEffect(() => {
        firebaseDB.child('tasks').on('value', snapshot => {
            if(snapshot.val() != null){
                let taskList = []
                for(let id in snapshot.val()){
                    taskList.push({id, ...snapshot.val()[id]})
                }
                setGetTask(taskList)
            }
        })
    }, [])

    const launchModal = () => {
        setOpenModal(!openModal)
    }

    const sortTask = (e) => {
        setSelectSort(e.target.value)
        if(e.target.value === 'alphabet'){
            setSortAlphabet(true)
        }else if(e.target.value === 'price'){
            setSortPrice(true)
        }
    }

    const reArrange = () => {
        if(selectSort === 'alphabet'){
            setAscend(!ascend)
            setSortAlphabet(!sortAlphabet)
        }else{
            setDscend(!descend)
            setSortPrice(!sortPrice)
        }
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber)


    // Still working on the filter
    const filterTags = (e) => {
        
        if(e.target.checked){
            filteredTags.push(e.target.value)
        }else{
            filteredTags = filteredTags.filter(t => t !== e.target.value)
        }

        let a = []
        filteredTags.map( filt => {
            let filter = getTask.filter(task => task.tag === filt)
            return a.push(filter)
        })
        if(a.length > 0){
            let b = a.reduce((a, b) => a.concat(b))
            setGetTask(b)
        }else{
            setGetTask(getTask)
        }
    }

    return (
        <>
            <div className='container'>
                <div className='header'>
                    <a href='/' className='logo'>GetriTracker</a>
                    <button className='add bbtn' onClick={launchModal}>
                        Add a new task <AiOutlinePlus />
                    </button>
                </div>
                <Modal isOpen={openModal} toggle={launchModal}>
                    <AddTask closeModal={closeModal} />
                </Modal>
                
                <div className='search'>
                    <input type='text' placeholder='Search Keyword' />
                    <AiOutlineSearch />
                    <div className='sort'>
                        <select value={selectSort} onChange={sortTask}>
                            <option value=''>Sort by</option>
                            <option value='alphabet'>Alphabetical</option>
                            <option value='price'>Task Price</option>
                        </select>
                        <button onClick={reArrange}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
                <div className='main'>
                    <div className={`tags ${open ? 'open-m' : ''}`}>
                        <div className='tag1'>
                            <div className='d-flex justify-content-between'>
                                <h6>Tags</h6>
                                <button className='d-lg-none bbtn' onClick={e => setOpen(!open)}>X</button>
                            </div>
                            {tags.map(tag => (
                                <p key={tag.id}>
                                    <input type='checkbox' value={tag.name} onChange={filterTags} />
                                    <span>{tag.name}</span>
                                </p>
                            ))}
                        </div>
                        <div className='tag2'>
                            <h6>Task Price Range</h6>
                            {priceRange.map(tag => (
                                <p key={tag.id}>
                                    <input type='checkbox' name={tag.name} />
                                    <span>{tag.name}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className='content'>
                        <div className='links container'>
                            <ul className='tsk'>
                                <li className='click d-lg-none' onClick={e => setOpen(!open)}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </li>
                                <li className='active'>Active Task (2)</li>
                                <li>Completed (1)</li>
                                <li>Archived (6)</li>
                                <li>Closed (0)</li>
                            </ul>
                            <ul className='page d-none d-lg-block'>
                                <li>Next</li>
                                <li>Prev</li>
                            </ul>
                        </div>
                        <div className='tasks'>
                            {currentPosts.map(task => (
                                <Task task={task} key={task.id} />
                            ))}
                        </div>
                        <Pagination 
                            postPerPage={postPerPage} 
                            totalPost={getTask.length} 
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default App