import React from 'react';
import PropType from 'prop-types';
import { Button, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Markup from './Markup';
import shuffle from 'lodash/shuffle';

class Game extends React.Component {
    static propType = {
        randomNumberCount: PropType.number.isRequired,
        isDisabled: PropType.bool.isRequired,
        onPress: PropType.func.isRequired,
        initialSeconds: PropType.number.isRequired,
        playAgain: PropType.func.isRequired,
    };
    state = {
        selectedIds: [],
        remaingSeconds: this.props.initialSeconds,
    };
    gameStatus = 'PLAYING';
    randomNumber = Array.from({ length: this.props.randomNumberCount }).map(
        () => 1 + Math.floor(40 * Math.random()),
    );
    target = this.randomNumber
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0);

    shuffleRendomNumber = shuffle(this.randomNumber);

    componentDidMount = () => {
        this.intervalId = setInterval(() => {
            this.setState(
                nextState => {
                    return { remaingSeconds: nextState.remaingSeconds - 1 };
                },
                () => {
                    if (this.state.remaingSeconds === 0) {
                        clearInterval(this.intervalId);
                    }
                },
            );
        }, 1000);
    };
    componentWillUnMount = () => {
        clearInterval(this.intervalId);
    };

    isNumberSelected = numberIndex => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    };

    selectNumber = numberIndex => {
        this.setState(nextState => ({
            selectedIds: [...nextState.selectedIds, numberIndex],
        }));
    };

    //WARNING! To be deprecated in React v17. Use componentDidUpdate instead.
    componentWillUpdate(nextProps, nextState) {
        if (
            nextState.selectedIds !== this.state.selectedIds ||
            nextState.remaingSeconds === 0
        ) {
            this.gameStatus = this.calGameStatus(nextState);

            if (this.gameStatus !== 'PLAYING') {
                clearInterval(this.intervalId);
            }
        }
    }

    calGameStatus = nextState => {
        const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
            return acc + this.shuffleRendomNumber[curr];
        }, 0);

        if (nextState.remaingSeconds === 0) {
            return 'LOST';
        }

        if (sumSelected < this.target) {
            return 'PLAYING';
        }
        if (sumSelected === this.target) {
            return 'WON';
        }
        if (sumSelected > this.target) {
            return 'LOST';
        }
    };

    render() {
        const gameStatus = this.gameStatus;
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Add Numbers</Text>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
                    {this.target}
                </Text>
                <Text style={[styles.sum, styles[`STATUS_${gameStatus}`]]}>
                    {this.state.selectedIds.map(number => {
                        return this.shuffleRendomNumber[number] + '+';
                    })}
                </Text>
                <View style={styles.numberConatiner}>
                    {this.shuffleRendomNumber.map((number, index) => (
                        <Markup
                            key={index}
                            id={index}
                            number={number}
                            isDisabled={
                                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
                            }
                            status={gameStatus}
                            onPress={this.selectNumber}
                        />
                    ))}
                </View>
                <Text style={styles.time}>Seconds Left</Text>
                <Text style={styles.countdown}>{this.state.remaingSeconds} </Text>
                <Text style={[styles.status, styles[`STATUS_${gameStatus}`]]}>
                    {' '}
                    {gameStatus}
                </Text>
                <TouchableOpacity onPress={this.props.playAgain}>
                    {this.gameStatus !== 'PLAYING' && (
                        <Text style={styles.playAgain}>Play Again</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    heading: {
        color: 'white',
        textAlign: 'center',
        fontSize: 40,
        marginBottom: 30,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    target: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
        backgroundColor: 'grey',
        borderRadius: 20,
        fontWeight: '900',
        letterSpacing: 3,
        paddingVertical: 10,
    },
    sum: {
        color: 'green',
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: '#ddd',
        borderRadius: 20,
        fontWeight: '900',
        letterSpacing: 3,
        paddingVertical: 10,
        marginTop: 30,
    },
    numberConatiner: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    time: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    countdown: {
        color: 'red',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    status: {
        color: 'green',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    STATUS_LOST: {
        color: 'white',
        backgroundColor: 'red',
    },
    STATUS_WON: {
        color: 'white',
        backgroundColor: '#E6A207',
    },
    STATUS_PLAYING: {
        color: 'white',
        backgroundColor: 'green',
    },
    playAgain: {
        color: 'blue',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 40,
        borderWidth: 2,
        borderColor: 'blue',
        borderStyle: 'solid',
        marginHorizontal: 60,
    },
});
export default Game;
