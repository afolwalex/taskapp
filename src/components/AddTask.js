
import React, { useEffect, useState } from 'react'
import {ModalBody} from 'reactstrap'
import firebaseDB from '../firebase'

const AddTask = ({currentId, closeModal}) => {

    const [name, setName] = useState('')
    const [tag, setTag] = useState('')
    const [price, setPrice] = useState('')
    const [delivery, setDelivery] = useState('')
    const [assigned, setAssigned] = useState('')
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(currentId === '' || currentId === undefined){
            setName('')
            setPrice('')
            setTag('')
            setDelivery('')
            setStatus('')
            setAssigned('')
        }else{
            setName(currentId.name)
            setPrice(currentId.price)
            setTag(currentId.tag)
            setDelivery(currentId.delivery)
            setAssigned(currentId.assigned)
        }
    }, [currentId])

    const addOrEdit = (e) => {
        e.preventDefault()
        setLoading(true)
        if(currentId === '' || currentId === undefined){
            firebaseDB.child('tasks').push(
                {
                    name, tag, price, delivery, assigned, status
                },
                err => {
                    if(err){
                        console.log(err)
                    }else{
                        setLoading(false)
                        setPrice('')
                        setDelivery('')
                        setName('')
                        setAssigned('')
                        setTag('')
                        setStatus('')
                        closeModal()
                    }
                }
            )
        }else{
            firebaseDB.child(`tasks/${currentId.id}`).set(
                {
                    name, tag, price, delivery, assigned, status
                },
                err => {
                    if(err){
                        console.log(err)
                    }else{
                        setLoading(false)
                        closeModal()
                    }
                }
            )
        }
    }

    return (
        <ModalBody className='form-body'>
            <form className='form' method='POST' onSubmit={addOrEdit}>
                <label htmlFor='name'>Name:</label>
                <input type='test' value={name} onChange={e => setName(e.target.value)} />
                <label htmlFor='name'>Tag:</label>
                <select value={tag} onChange={e => setTag(e.target.value)}>
                    <option value=''>Select one</option>
                    <option value='Custom task'>Custom task</option>
                    <option value='Marketing & Sales'>Marketing & Sales</option>
                    <option value='Integrations'>Integrations</option>
                    <option value='Optimization'>Optimization</option>
                    <option value='Deployment'>Deployment</option>
                    <option value='Testing'>Testing</option>
                </select>
                <label htmlFor='name'>Price:</label>
                <input type='number' value={price} onChange={e => setPrice(e.target.value)} />
                <label htmlFor='name'>Delivery Period (In Days):</label>
                <input type='number' value={delivery} onChange={e => setDelivery(e.target.value)} />
                <label htmlFor='name'>Assigned to:</label>
                <input type='test' value={assigned} onChange={e => setAssigned(e.target.value)} />
                <label htmlFor='name'>Status:</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value=''>Select one</option>
                    <option value='Verify'>Verify</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='In Review'>In Review</option>
                    <option value='Waiting Approval'>Waiting Approval</option>
                </select>
                <div className='text-center'>
                    <button 
                        type='submit' className='btn btn-info'
                        disabled={name && price && tag && delivery && !loading ? false : true}
                    >
                        {currentId === undefined ? 'Add' : 'Update'}
                    </button>
                    {loading && <p><i>Loading...</i></p>}
                </div>
            </form>
        </ModalBody>
    )
}

export default AddTask