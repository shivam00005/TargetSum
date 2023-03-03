import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import PropType from 'prop-types';

class Markup extends React.Component {
  static propType = {
    number: PropType.number.isRequired,
    isDisabled: PropType.bool.isRequired,
    onPress: PropType.func.isRequired,
  };
  handlerPress = () => {
    if (this.props.isDisabled) {
      return;
    } else {
      this.props.onPress(this.props.id);
    }
  };
  render() {
    return (
      <TouchableOpacity onPress={this.handlerPress}>
        <Text
          style={[
            styles.number,
            this.props.isDisabled && styles.disabled,
            styles[`STATUS_${this.props.status}`],
          ]}>
          <Text style={styles.span}>{this.props.number}</Text>
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  number: {
    fontSize: 40,
    width: 80,
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'grey',
    borderRadius: 20,
    marginTop: 40,
    fontWeight: '900',
  },
  span: {
    lineHeight: 80,
  },
  disabled: {
    backgroundColor: 'grey',
    color: 'white',
    opacity: 0.3,
  },
  STATUS_LOST: {
    color: 'white',
    backgroundColor: '#fc6868',
  },
  STATUS_WON: {
    color: 'white',
    backgroundColor: '#baa65d',
  },
  STATUS_PLAYING: {
    color: 'white',
    backgroundColor: '#3f6e3b',
  },
});

export default Markup;
