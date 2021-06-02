
import { useState } from 'react'
import {AiOutlineMessage} from 'react-icons/ai'
import {MdMessage} from 'react-icons/md'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal } from 'reactstrap'
import AddTask from './AddTask'
import firebaseDB from '../firebase'

const Task = ({task}) => {

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const toggle = () => setDropdownOpen(!dropdownOpen)

    const launchModal = () => {
        setOpenModal(!openModal)
    }

    const launchDeleteModal = () => {
        setDeleteModal(!deleteModal)
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    const deleteTaskHandler = () => {
        firebaseDB.child(`tasks/${task.id}`).remove(
            err => {
                if(err){
                    console.log(err)
                }else{
                    setDeleteModal(false)
                }
            }
        )
    }

    return (
        <>
            <div className='card-task container'>
                <div className='row'>
                    <div className='col-lg-4 mb-3'>
                        <div className='d-flex first'>
                            <AiOutlineMessage size={30} />
                            <div className='name'>
                                <p className='bold mb-1'>{task.name}</p>
                                <span className='small'>{task.tag}</span>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-5 mb-3 d-flex justify-content-between'>
                        <div className='price'>
                            <p className='bold'>N{task.price.toLocaleString()}</p>
                            <p className='small mb-2'>task price</p>
                            <p className='bold small'>Delivery: <span>within {task.delivery} days</span></p>
                        </div>
                        <div className='d-flex user'>
                            <img src='/user.png' alt='User' />
                            <div className=''>
                                <p className='bold'>{task.assigned}</p>
                                <p className='small'>Assigned to</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-3 mb-3 status d-flex justify-content-between'>
                        <div className='mt-2'>
                            <span className='main-btn'>Verify</span>
                        </div>
                        <MdMessage />
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle nav caret className="usr">
                                <span className='drop'>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </DropdownToggle>
                            <DropdownMenu right className="shadow">
                                <DropdownItem onClick={launchModal}>Edit</DropdownItem>
                                <DropdownItem onClick={launchDeleteModal}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <Modal isOpen={openModal} toggle={launchModal}>
                <AddTask 
                    currentId={{id: task.id, name: task.name, delivery: task.delivery, tag: task.tag, price: task.price, assigned: task.assigned}}  
                    closeModal={closeModal}
                />
            </Modal>

            <Modal isOpen={deleteModal} toggle={launchDeleteModal}>
                <div className='modal-body'>
                    <p>Are you sure you want to delete this task?</p>
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-sm btn-danger' onClick={deleteTaskHandler}>Yes</button>
                    <button className='btn btn-sm btn-info' onClick={launchDeleteModal}>No</button>
                </div>
            </Modal>
        </>
    )
}

export default Task