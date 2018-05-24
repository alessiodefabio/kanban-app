import React, {Component} from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import update from 'react-addons-update';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type' : 'application/json',
    Authorization: 'any-string-like-you'
}

class KanbanBoardContainer extends Component{
    constructor(){
        super(...arguments);
        this.state  = {
            cards:[]
        };
    }

    componentDidMount() {
        //console.log("Start request");
        fetch(API_URL + '/cards', {headers: API_HEADERS})
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({cards: responseData}, function () {
                    console.log("request");
                    console.log(this.state.cards)});
            })
            .catch((error) => {
                console.log('Error fatching and parsing data', error);
            });
        console.log(this.state.cards);
    }

    addTask(cardId, taskName){
        //console.log("Sono nell'add");
        //console.log(this.state.cards);
        let cardIndex = this.state.cards.findIndex((card)=> card.id === cardId);
        let newTask = {id:Date.now(), name:taskName, done:false};
        if(cardIndex > 0) {
            let nextState = update(this.state.cards, {
                [cardIndex]: {
                    tasks: {$push: [newTask]}
                }
            });
            this.setState({cards: nextState});
        }
    }

    deleteTask(cardId, taskId, taskIndex){

        let cardIndex = this.state.cards.findIndex((card)=>card.id === cardId);
        if(cardIndex > 0) {
            let nextState = update(this.state.cards, {
                [cardIndex]: {
                    tasks: {$splice: [[taskIndex, 1]]}
                }
            });

            this.setState({cards: nextState});
        }

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method:'delete',
            headers: API_HEADERS
        });
    }

    toggleTask(cardId, taskId, taskIndex){
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let newDoneValue;
        if(cardIndex > 0) {
            let nextState = update(this.state.cards, {
                [cardIndex]: {
                    tasks: {
                        [taskIndex]: {
                            done: {
                                $apply: (done) => {
                                    newDoneValue = !done;
                                    return newDoneValue;
                                }
                            }
                        }
                    }
                }
            });
            this.setState({cards:nextState});
        }
    }

    render(){
        return <KanbanBoard cards = {this.state.cards}
                taskCallbacks={
                    {
                        toggle: this.toggleTask.bind(this),
                        delete: this.deleteTask.bind(this),
                        add: this.addTask.bind(this)
                    }}/>
    }
}

export default KanbanBoardContainer;