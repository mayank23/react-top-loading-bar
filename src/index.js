import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

class LoadingBar extends Component {
  state = {
    show: true,
    full: false,
    progress: 0,
    wait: false
  }

  add = value => {
    this.setState({ progress: this.state.progress + value }, () => {
      this.onProgressChange()
    })
  }

  onProgressChange = () => {
    if (this.props.onProgressChange)
      this.props.onProgressChange(this.state.progress)

    this.checkIfFull()
  }

  decrease = value => {
    this.setState({ progress: this.state.progress - value }, () => {
      this.onProgressChange()
    })
  }

  randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
  }

  continousStart = startingValue => {
    const random = startingValue || this.randomInt(20, 30)
    this.setState({ progress: random })

    const interval = setInterval(() => {
      if (this.state.progress < 90) {
        const random = this.randomInt(2, 10)
        if (!this.mounted) return false
        this.setState({ progress: this.state.progress + random }, () => {
          this.onProgressChange()
        })
      } else {
        clearInterval(interval)
      }
    }, 1000)
  }

  staticStart = startingValue => {
    const random = startingValue || this.randomInt(30, 50)

    this.setState({ progress: random }, () => {
      this.onProgressChange()
    })
  }

  complete = () => {
    this.setState({ progress: 100 }, () => {
      this.onProgressChange()
    })
  }

  onLoaderFinished = () => {
    if (this.props.onLoaderFinished) this.props.onLoaderFinished()

    this.setState({ progress: 0 }, () => {
      this.onProgressChange()
    })
  }

  render() {
    const { className, height } = this.props
    const { show, full } = this.state
    return (
      <div style={{ height: height }}>
        {show ? (
          <div
            className={
              styles['loading-bar'] +
              ' ' +
              (className || '') +
              ' ' +
              (full ? styles['loading-bar-full'] : '')
            }
            style={this.barStyle()}
          />
        ) : null}
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    // Watching Progress Changes
    if (nextProps.progress !== this.props.progress) {
      this.setState({ progress: nextProps.progress }, () => {
        if (this.props.onProgressChange != null) {
          this.props.onProgressChange()
        }
        this.checkIfFull()
      })
    }
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.onRef) this.props.onRef(this)

    if (this.state.progress !== this.props.progress) {
      this.setState({ progress: this.props.progress })
    }
  }
  componentWillUnmount() {
    this.mounted = false
    if (this.props.onRef) this.props.onRef(undefined)
  }
  // Check whether the progress is full
  checkIfFull = () => {
    if (!this.mounted) return false

    if (this.state.progress >= 100) {
      // Prevent new progress change
      this.setState({ wait: true })

      // Start animate it
      setTimeout(() => {
        if (!this.mounted) return false
        // animate when element removed
        this.setState({
          full: true,
          myError: false
        })

        setTimeout(() => {
          if (!this.mounted) return false
          this.setState({
            // remove bar element
            show: false,
            progress: 0,
            wait: false
          })

          setTimeout(() => {
            if (!this.mounted) return false
            this.setState({
              // Show Bar
              full: false,
              show: true
            })
            this.onLoaderFinished()
          })

          // Duration to Waiting for hiding animation
        }, 250)

        // Duration is depend on css animation-duration of loading-bar
      }, 700)
    }
  }

  // apply width style to our element as inline style
  barStyle() {
    // When loading bar still in progress
    const { color, background } = this.props

    if (!this.state.wait) {
      return {
        width: `${this.state.progress}%`,
        backgroundColor: color,
        background: background
      }
    } else {
      return { width: '100%', backgroundColor: color, background }
    }
  }
}

LoadingBar.defaultProps = {
  progress: 0,
  color: '#f11946',
  height: 3,
  className: '',
  background: ''
}

LoadingBar.propTypes = {
  progress: PropTypes.number,
  color: PropTypes.string,
  background: PropTypes.string,
  height: PropTypes.number,
  onLoaderFinished: PropTypes.func,
  onProgressChange: PropTypes.func,
  className: PropTypes.string,
  onRef: PropTypes.func
}
export default LoadingBar
