import axios from 'axios';
import {  shuffle, uniq } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../memoryNum/memoryNum.css'
import Records from '../records';

const LocationMemory = () => {

    let shuffleArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const siteName = 'locationMemory';
    const [showRecords,setShoeRecords] = useState(false)
    const name = localStorage.getItem("name")
    const ar1 = [1, 2, 3, 4];
    const ar2 = [5, 6, 7, 8];
    const ar3 = [9, 10, 11, 12];
    const ar4 = [13, 14, 15, 16];
    const [record,setRecord] = useState(0)
    const [stage,setStage] = useState(1)
    const [level, setLevel] = useState(5)
    let timer;
    let count = 1
    const [canClick, setCanClick] = useState(false)
    const [canPlay, setCanPlay] = useState(true)
    const [arr, setAr] = useState([])

    const shuffleNum = () => {
        setCanPlay(false)
        setCanClick(false)

        setAr([])
        for (let i = 1; i <= 16; i++) {
            document.querySelector(`#btn${i}`).style.backgroundColor = 'black'
            document.querySelector(`#btn${i}`).innerHTML = ''
        }
        clearInterval(timer)

        shuffleArr = shuffle(shuffleArr)


        setAr(shuffleArr)

        timer = setInterval(runColor, 1345)


    }
    const runColor = () => {
        let ar = uniq(shuffleArr)
        if (count < level) {
            document.querySelector(`#btn${ar[count - 1]}`).style.backgroundColor = 'black'
            document.querySelector(`#btn${ar[count]}`).style.backgroundColor = 'orange'
        }

        console.log(ar[count])
        count++


        if (count >= level + 1) {
            for (let i = 1; i <= 16; i++) {
                document.querySelector(`#btn${i}`).style.backgroundColor = 'black'

            }
            count = 1;
            setCanClick(true)
            clearInterval(timer)
        }
    }
    useEffect(() => {
        getRecord();
    },[])
    const getRecord = async() => {
        let {data} = await axios.get(`https://moreservgame.herokuapp.com/locationMemory/${name}`)  
       setRecord(data.record)
    }
    let i = 1;
    let y = 0;
    const checkResult = (x) => {

        if (arr[i] === x) {
            document.querySelector(`#btn${x}`).style.backgroundColor = 'green';
            document.querySelector(`#btn${x}`).innerHTML = i;
            y++
        }
        else {
            document.querySelector(`#btn${x}`).style.backgroundColor = 'red';
            console.log("loss")
            setCanClick(false)
            setCanPlay(true)
            document.querySelector('#id_h1').innerHTML = 'LOSS'
            document.querySelector('#id_h1').style.color = 'red'
            if(level > 4) setLevel(level-1)
            if(stage > 1) setStage(stage-1)
        }
        i++;
        if (i == level) {
            if (y == level - 1) {
                console.log("win")
                setCanPlay(true)
                setCanClick(false)
                if (level < 16) setLevel(level+1)
                setStage(stage+1)
                if(level > record){
                    (async()=>{
                        let {data} = await axios.put(`https://moreservgame.herokuapp.com/locationMemory/${name}`,{
                            username:name,
                            record:record+1
                        })  
                       setRecord(data.record)
                    })();
                    
                }
                document.querySelector('#id_h1').innerHTML = 'WIN'
                document.querySelector('#id_h1').style.color = 'green'
            }
        }

    }

    return (
        <div>
            <div>
                {ar1.map(x =>
                    <button
                        disabled={!canClick}
                        onClick={() => checkResult(x)}
                        key={x}
                        id={`btn${x}`}
                        style={{ width: 70, height: 70, backgroundColor: 'black' }}
                        className='btn btn rounded-circle m-1' >

                    </button>
                )}
                <br />
                {ar2.map(x =>
                    <button
                        disabled={!canClick}
                        onClick={() => checkResult(x)}
                        key={x}
                        id={`btn${x}`}
                        style={{ width: 70, height: 70, backgroundColor: 'black' }}
                        className='btn btn rounded-circle m-1 '>
                    </button>
                )}
                <br />
                {ar3.map(x =>
                    <button
                        disabled={!canClick}
                        onClick={() => checkResult(x)}
                        key={x}
                        id={`btn${x}`}
                        style={{ width: 70, height: 70, backgroundColor: 'black' }}
                        className='btn btn rounded-circle m-1 '>
                    </button>
                )}
                <br />
                {ar4.map(x =>
                    <button
                        disabled={!canClick}
                        onClick={() => checkResult(x)}
                        key={x}
                        id={`btn${x}`}
                        style={{ width: 70, height: 70, backgroundColor: 'black' }}
                        className='btn btn rounded-circle m-1 '>
                    </button>
                )}
            </div>
            <br />

            <button disabled={!canPlay} onClick={shuffleNum}>shuffle</button>
            <h1 id='id_h1' className='css-3d-text'></h1>
            <br />
            <h1 className='display-4'>Level: {stage} | Record: {record}</h1>
            
            <button className='btn btn-outline-dark bg-danger' onClick={()=> setShoeRecords(!showRecords)}>records</button>
            {
                showRecords && <Records gameName={siteName} />
            }
        </div>
    )
}

export default LocationMemory