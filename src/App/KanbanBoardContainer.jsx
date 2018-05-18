import React, {Component} from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';

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
        fetch(API_URL + '/cards', {headers: API_HEADERS})
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({cards: responseData});
            })
            .catch((error) => {
                console.log('Error fatching and parsing data', error);
            });
    }

    addTask(cardId, taskName){

    }

    deleteTask(cardId, taskId, taskIndex){

        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice: [[taskIndex, 1]]}
            }
        });

        this.setState({cards:nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method:'delete',
            headers: API_HEADERS
        });
    }

    toggleTask(cardId, taskId, taskIndex){

    }

    render(){
        return <KanbanBoard cards = {this.state.cards}
                taskCallBacks={
                    {
                        toggle: this.toggleTask(this),
                        delete: this.deleteTask(this),
                        add: this.addTask(this)
                    }}/>
    }
}

export default KanbanBoardContainer;