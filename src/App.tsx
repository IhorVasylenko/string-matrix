import React, {useEffect, useState} from 'react';
import style from './App.module.css';

function App() {

    const [string, setString] = useState('');
    const [word, setWord] = useState('');
    const [coordinatesOfLetters, setCoordinatesOfLetters] = useState<number[][]>([]);
    const [buttonResetOn, setButtonResetOn] = useState(false);
    const [buttonImplementOn, setButtonImplementOn] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (string.length === 0) {
            setWord('');
        }
    }, [string]);

    const regEx = /^[A-Z]*$/;
    const characterArrayLength = string.split('').length;
    const lines = Math.sqrt(characterArrayLength);
    const splitArr: any[] = [];
    for (let x = 0, z = lines; x < string.split('').length; x += lines, z += lines) {
        splitArr.push(string.split('').slice(x, z));
    }
    const result: number[][] = [];

    const onClickHandlerStringValidationCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCoordinatesOfLetters([]);
        setError('');
        if (regEx.test(e.currentTarget.value.toUpperCase())) {
            if (characterArrayLength === 0) {
                setString(e.currentTarget.value.toUpperCase());
                setButtonResetOn(true);
            }
            if (Number.isInteger(Math.sqrt(characterArrayLength + 1))) {
                setString(e.currentTarget.value.toUpperCase());
                setButtonImplementOn(false);
            } else {
                setString(e.currentTarget.value.toUpperCase());
                setButtonImplementOn(true);
                setError('The number of characters must be n^2');
            }
        } else {
            setError('Only english alphabetic characters');
        }
    };

    const onClickHandlerWordValidationCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const wordArrayLength = word.split('').length;
        const incomingValue = e.currentTarget.value.toUpperCase();
        setError('');

        if (regEx.test(e.currentTarget.value.toUpperCase())) {
            if (wordArrayLength === 0 && string.indexOf(incomingValue) !== -1) {
                setWord(e.currentTarget.value.toUpperCase());
                setButtonResetOn(true);
            }
            if (string.indexOf(incomingValue.substr(incomingValue.length - 1), 1) !== -1) {
                setWord(e.currentTarget.value.toUpperCase());
            }
        } else {
            setError('Only english alphabetic characters');
        }
    };

    const onClickHandlerClearAllStates = () => {
        setString('');
        setWord('');
        setButtonResetOn(false);
        setButtonImplementOn(true);
        setError('');
        setCoordinatesOfLetters([])
    };

    const onClickHandlerMatrix = () => {
        let counter = 0;

        for (let y = 0; y < word.length; y++) {
            for (let i = 0; i < splitArr.length; i++) {
                if (y === 0 && result.length === 0 && splitArr[i].includes(word[y])) {
                    result.push([i, splitArr[i].indexOf(word[y])]);
                    setCoordinatesOfLetters([...result]);
                    break;
                }
                if (y !== 0 && splitArr[i - 1] && splitArr[i - 1][result[result.length - 1][1]] === word[y]) {
                    result.push([i - 1, result[counter][1]]);
                    setCoordinatesOfLetters([...result]);
                    counter++;
                    break;
                }
                if (
                    y !== 0
                    && splitArr[i][result[counter][1] - 1]
                    && splitArr[i][result[result.length - 1][1] - 1] === word[y]
                )
                {
                    result.push([i, result[counter][1] - 1]);
                    setCoordinatesOfLetters([...result]);
                    counter++;
                    break;
                }
                if (
                    y !== 0
                    && splitArr[i][result[counter][1] + 1]
                    && splitArr[i][result[result.length - 1][1] + 1] === word[y]
                )
                {
                    result.push([i, result[counter][1] + 1]);
                    setCoordinatesOfLetters([...result]);
                    counter++;
                    break;
                }
                if (y !== 0 && splitArr[i + 1] && splitArr[i + 1][result[result.length - 1][1]] === word[y]) {
                    result.push([i + 1, result[counter][1]]);
                    setCoordinatesOfLetters([...result]);
                    counter++;
                    break;
                } else {
                    setError(`Checking stopped ! Inside your test word is the symbol "${word[y]}" must be in close
                     proximity to the  preceding symbol "${word[y - 1]}" for example top, bottom, left or right !`);
                    y = word.length + 1;
                    i = splitArr.length + 1;
                }
            }
        }
    };

    return (
        <div className={style.container} style={{display: 'flex', flexDirection: 'column', margin: '100px auto', width: '60vw'}}>
            <input
                type="text"
                placeholder={'Enter only english alphabetic characters n^2'}
                value={string}
                onChange={(e) => onClickHandlerStringValidationCheck(e)}/>
            <input
                disabled={string.length === 0 || !buttonResetOn}
                type="text"
                placeholder={'Enter a test word'}
                value={word}
                onChange={(e) => onClickHandlerWordValidationCheck(e)}/>
            <input type="button" onClick={onClickHandlerMatrix} value={'Implement'} disabled={buttonImplementOn}/>
            <input type="button" onClick={onClickHandlerClearAllStates} value={'Reset'} disabled={!buttonResetOn}/>
            {
                Number.isInteger(lines)
                    ? <table>
                        <tbody>
                        {splitArr.map((arr: number[], index) => <tr key={index}>
                            {arr.map((ins: number, index) => <td key={index}>
                                {ins}
                            </td>)}
                        </tr>)}
                        </tbody>
                    </table>
                    : null
            }
            <ul>{coordinatesOfLetters.map((ins: number[]) => <li>{ins[0] + '-' + ins[1]}</li>)}</ul>
            {
                error
                    ? <span style={{color: "red"}}>{error}</span>
                    : null
            }
        </div>
    )
}

export default App;
