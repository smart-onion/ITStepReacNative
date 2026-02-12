import { Text, useWindowDimensions, View } from "react-native";
import CalcStyle from "./css/CalcStyle";
import CalcButton from "./ui/button/CalcButton";
import CalcButtonType from "./ui/button/CalcButtonType";
import ICalcButtonData from "./ui/button/ICalcButtonData";
import { useState } from "react";
import CalcOperations from "./model/CalcOperations";

const divZeroMessage = "Cannot divide by zero";
const dotSymbol     = ',';
const minusSymbol   = '-';
const addSymbol     = '+';
const divSymbol     = '÷';
const mulSymbol     = '×';
const subSymbol     = '-';
const square        = 'x²';
const squaredRoot   = '√x';
const persent       = '%';
const maxDigits     = 16;
const shortSpace    = ' ' 
// memory consts
const memoryClear   = "MC";
const memoryRecall  = "MR";
const memoryPlus    = "M+";
const memoryMinus   = "M-";
const memorySet     = "MS";

interface ICalcState {

    result: string,                           // вміст основного поля калькулятора - "екрану"
    expression: string,                       // вираз, що формується вище "результату"
    needClearResult: boolean,                 // потреба стерти результат при початку введення (після операцій)                    
    needClearExpression: boolean,             // потреба стерти вираз при початку введення (після операцій)                 
    isError: boolean,                         // чи знаходиться калькулятор в аварійному стані (показ помилки)    
    operation?: CalcOperations | undefined,   // операція, що була натиснена (+/-/*...)
    prevArgument?: number | undefined,  
    memory: number,      // аргумент, що був перед натисненням операції
    isMemoryMode: boolean
};

const initialState:ICalcState = {
    result: "0",
    expression: "",
    needClearResult: false,        
    needClearExpression: false,
    isError: false, 
    memory: 0  ,
    isMemoryMode: false,
};

export default function Calc() {
    const {width, height} = useWindowDimensions();
    const [calcState, setCalcState] = useState<ICalcState>(initialState);


    // useEffect(() => {
    //     if(calcState.result.length == 5){
    //         setCalcState({...calcState,
    //             result: calcState.result.slice(0,2) + shortSpace + calcState.result.slice(2)
    //         })
    //     }
    // }, [calcState.result])

    const operationClick = (btn:ICalcButtonData) => {
        const newState:ICalcState = {...calcState,
            needClearResult: true,
            needClearExpression: false,
            operation: 
                btn.text    == divSymbol    ? CalcOperations.div
                : btn.text  == mulSymbol    ? CalcOperations.mul
                : btn.text  == addSymbol    ? CalcOperations.add
                : btn.text  == subSymbol    ? CalcOperations.sub
                : undefined,
        };
        if(calcState.operation) {   // повторне натискання -- є попередня невиконана операція, слід обчислити
            const prevResult = doOperationWithState();
            const res = numToResult(prevResult);
            newState.expression = res + ' ' + btn.text;
            newState.result = res;
            newState.prevArgument = prevResult;
        }
        else {
            newState.expression = calcState.result + ' ' + btn.text;
            newState.prevArgument = resToNumber();
        }
        setCalcState(newState);
    };

    const equalClick = (_:ICalcButtonData) => {
        let res = resToNumber() < 0 ? ` (${calcState.result})` : calcState.result
        if(calcState.operation) {
            setCalcState({...calcState,
                expression: calcState.expression + ' ' + res + ' =',
                needClearResult: true,
                needClearExpression: true,
                prevArgument: undefined,
                operation: undefined,
                result: numToResult( doOperationWithState() ),
            });
        }
    };

    const doOperationWithState = ():number => {
        const arg = resToNumber();
        return  calcState.operation == CalcOperations.div ? calcState.prevArgument! / arg 
            :   calcState.operation == CalcOperations.mul ? calcState.prevArgument! * arg 
            :   calcState.operation == CalcOperations.add ? calcState.prevArgument! + arg 
            :   calcState.operation == CalcOperations.sub ? calcState.prevArgument! - arg 
            :   Number.NaN
    };

    const sqr = () => {
        let res = resToNumber() ** 2;
        setCalcState({...calcState,
            result: res.toString(),
            expression: `sqr(${calcState.result})`
        })
    }

    const sqrt = () => {
        if (resToNumber() < 0){
            setCalcState({...calcState,
                isError: true,
                result: "Incorect input"
            })
            return;
        }
        setCalcState({...calcState,
            result: Math.sqrt(resToNumber()).toString(),
            expression: squaredRoot + calcState.result
        })
    }

    const convertResult = () => {

    }

    const persentoperation = () => {

        setCalcState({...calcState,
            result: !calcState.prevArgument ? calcState.result
            :   ((calcState.prevArgument / 100) * resToNumber()).toString()
        })
    }
    
    const rec = (res:string):string => {
        
        const inner = (s:string):string => {
            s = s.replace(/\s/g, "");
            if (s.length <= 3){
                return s;
            }
            return inner(s.slice(0, -3)) + shortSpace + s.slice(-3);
        }

        let i = res.indexOf(dotSymbol);
        if (i > 0){
            let afterDot = res.slice(i);
            let beforeDot = res.slice(0, i)
            res = inner(beforeDot) + afterDot

        }else{
            res = inner(res)
        }
        return res;
    }
    const digitClick = (btn:ICalcButtonData) => {
        var res = calcState.result;
        if(calcState.needClearResult || calcState.isError || res == '0') {
            res = "";
            calcState.needClearResult = false;
            calcState.isError = false;
        }
        if(calcState.needClearExpression) {
            calcState.needClearExpression = false;
            calcState.expression = "";
        }
       
        res = rec(res + btn.text)
        //console.log(res)
        // Обмежити введення 16 (maxDigits) цифрами (саме цифрами, точку та знак (мінус) ігнорувати)
        if(res.replace(dotSymbol, '').replace(minusSymbol, '').replace(/\s/g, "").length > maxDigits){
            console.log("max digits exeed") 
            console.log(res) 
            return
        }

        setCalcState({...calcState, result: res});
    };

    const backspaceClick = (_:ICalcButtonData) => {
        // setCalcState({...calcState, 
        //     result: calcState.result.length > 1
        //     ? calcState.result.substring(0, calcState.result.length - 1)
        //     : "0"
        // });
        setCalcState(prevState => {
            let result = calcState.result.substring(0, calcState.result.length - 1);
            result = rec(result)
            if(prevState.needClearExpression) {
                prevState.needClearExpression = false;
                prevState.expression = "";
            }
            if(prevState.needClearResult) {
                prevState.needClearResult = false;
                prevState.result = "0";
            }
            else {
                prevState.result = calcState.result.length > 1
                 ? result
                 : "0"
            }
            return {...prevState};
        });
    }

    const dotClick = (btn:ICalcButtonData) => {
        // десятична кома (точка):
        // якщо на рез. "0", то він не стирається, буде "0,"
        // якщо у рез. вже є кома, то натиснення ігнорується
        // Символ коми відповідає тексту на кнопці
        const newState = {...calcState};

        if(calcState.needClearExpression) {
            newState.expression = "";
            newState.needClearExpression = false;
        }

        if(calcState.needClearResult) {
            newState.result = "0" + dotSymbol;
            newState.needClearResult = false;
        }
        else if(! calcState.result.includes(btn.text)) {
            newState.result = calcState.result + btn.text;
        }
        setCalcState(newState);
    };

    const inverseClick = (_:ICalcButtonData) => {
        var arg = resToNumber();
        setCalcState({...calcState, 
            expression: `1/(${calcState.result})`,
            needClearExpression: true,
            needClearResult: true,
            isError: arg == 0,
            result: arg == 0
                ? divZeroMessage
                : numToResult(1.0 / arg)
        });
        // 1. Перевищення кількості цифр 
        // 2. Символ точки (коми) не відповідає dotSymbol
        //  2.2 Через це також не парситься число, введене з комою (dotSymbol)
        // 3. 1/0 ??
        // 4. Натиснення цифрових кнопок дописується до результату 
        // 5. Не заповнюється поле виразу
        // 6. Блокування функціональних кнопок у випадку помилки (коли результат - повідомлення)
    };

    const clearClick = (_:ICalcButtonData) => {
        setCalcState({...calcState, 
            expression: "",
            isError: false,
            result: "0",
            operation: undefined,
            prevArgument: undefined
        });
    }

    const clearEntry = () => {
        setCalcState({...calcState,
            result: "0"
        })
    }

    const resToNumber = (): number => {
        var res = calcState.result.replace(dotSymbol, '.').replace(minusSymbol, '-').replace(shortSpace, "");
        return res.length > 0 ? Number(res) : 0;
    };

    const numToResult = (num: number): string => {
        var res = num.toString();
        if(num >= 1e-6) {   // <= 9.9e-7 автоматично спрацьовує ехр-форма
            res = res.substring(0, maxDigits + 1);   // +1 - на символ коми
        }
        res = res.replace('.', dotSymbol);   // замінюємо стандарту десятичну точку на dotSymbol
        return res;
    }

    const memoryFunc = (btn: ICalcButtonData) => {
        let m = btn.text
        
        setCalcState({...calcState, 
            memory :        m == memoryClear ? 0 
                        :   m == memoryPlus ? calcState.memory + resToNumber()
                        :   m == memoryMinus ? calcState.memory - resToNumber()
                        :   m == memorySet ? resToNumber()
                        :   calcState.memory,
            result :        m == memoryRecall ? numToResult(calcState.memory) : calcState.result,
            isMemoryMode:   m == memoryClear ? false : true
        })
        console.log(calcState)
    }

    const plusMinus = () => {
        setCalcState({...calcState,
            result: resToNumber() != 0 ? (- resToNumber()).toString() : "0"
        })
    }

    const portraitView = () => <View style={CalcStyle.calc}>
            <Text style={CalcStyle.calcMemoryResult}>Memory: {calcState.memory}</Text>
            <Text style={CalcStyle.expression}>{calcState.expression}</Text>
        <Text style={[CalcStyle.result, {fontSize: (calcState.result.length <= 12 ? 50 : (width - 20) / calcState.result.length * 1.8 )}]}>{calcState.result}</Text>
        <View style={CalcStyle.memoryRow}>
            <CalcButton data={{text: memoryClear, buttonType: calcState.isMemoryMode ? CalcButtonType.memory : CalcButtonType.disabled, action: memoryFunc}} />
            <CalcButton data={{text: memoryRecall, buttonType: calcState.isMemoryMode ? CalcButtonType.memory : CalcButtonType.disabled,action: memoryFunc}} />
            <CalcButton data={{text: memoryPlus, buttonType: CalcButtonType.memory,action: memoryFunc}} />
            <CalcButton data={{text: memoryMinus, buttonType: CalcButtonType.memory,action: memoryFunc}} />
            <CalcButton data={{text: memorySet, buttonType: CalcButtonType.memory,action: memoryFunc}} />

        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:persent,  buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: persentoperation }}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation, action: clearEntry}}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: clearClick }}/>
            <CalcButton data={{text:"⌫", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: backspaceClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1/x", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:square,  buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: sqr}}/>
            <CalcButton data={{text:squaredRoot,  buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: sqrt}}/>
            <CalcButton data={{text:divSymbol,   buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:mulSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:subSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:addSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"+/-", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: plusMinus    }}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:dotSymbol, buttonType: CalcButtonType.digit, action: dotClick }}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal, action: equalClick }}/>
        </View>
    </View>;

    const landscapeView = () => <View style={CalcStyle.calc}>
        <View style={CalcStyle.containerResExpMem}>
                <Text style={CalcStyle.calcMemoryResult}>Memory: {calcState.memory}</Text>
    <Text style={CalcStyle.expression}>{calcState.expression}</Text>
                
                
                        
            </View>
            <Text style={[
                        CalcStyle.result, 
                        {fontSize: (calcState.result.length <= 12 ? 40 : (width - 20) / calcState.result.length * 1.0 )}]}>{calcState.result}
                </Text>  
            <View style={CalcStyle.containerExpMem}>
                    <View style={CalcStyle.memoryRow}>
                        <CalcButton data={{text: memoryClear, buttonType: calcState.isMemoryMode ? CalcButtonType.memory : CalcButtonType.disabled, action: memoryFunc}} />
                        <CalcButton data={{text: memoryRecall, buttonType: calcState.isMemoryMode ? CalcButtonType.memory : CalcButtonType.disabled,action: memoryFunc}} />
                        <CalcButton data={{text: memoryPlus, buttonType: CalcButtonType.memory,action: memoryFunc}} />
                        <CalcButton data={{text: memoryMinus, buttonType: CalcButtonType.memory,action: memoryFunc}} />
                        <CalcButton data={{text: memorySet, buttonType: CalcButtonType.memory,action: memoryFunc}} />

                    </View>
               
                </View>  
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:persent,  buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: persentoperation }}/>
            <CalcButton data={{text:divSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: clearClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1/x", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:mulSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation, action: clearEntry}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:square, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: sqr}}/>
            <CalcButton data={{text:minusSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:"⌫", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: backspaceClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:squaredRoot, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: sqrt}}/>
            <CalcButton data={{text:addSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"+/-", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation  , action: plusMinus  }}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick }}/>
            <CalcButton data={{text:dotSymbol, buttonType: CalcButtonType.digit, action: dotClick    }}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal , action: equalClick   }}/>
        </View>
    </View>;        
        
    return width < height ? portraitView() : landscapeView();
}
/*
Д.З. Модифікувати стиль для неактивної кнопки - зробити колір тексту менш яскравим. 
Доповнити деактивацією усі кнопки, що цього стосуються.
Внести усі напрацювання до ландшафтного представлення застосунку. 
До репозиторію або окремо до ДЗ додати два скріншоти у двох представленнях. 


Д.З. Реалізувати розділення розрядів цифр при введенні довгих чисел
(пробіл між групами цифр по 3:   12 345 678), можна використати
спец символи Юнікоду - короткі пробіли. 
Скоригувати обмеження - не враховувати пробіли в обмеженні на 
максимальну кількість цифр, що можна набрати. 
Зауважити роботу Backspace, оскільки він перерозподілятиме пробіли
(12 345 678 -> 1 234 567)

Д.З. Завершити проєкт "Калькулятор"
*/