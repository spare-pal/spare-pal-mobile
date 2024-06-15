import PropTypes from 'prop-types'
import React from 'react'
import { Animated, Image, PanResponder, View } from 'react-native'

class CollageImage extends React.Component {
  constructor(props) {
    super(props)

    this.id = props.imageId

    this.state = {
      selected: false,
      animating: false,
      panningX: 0,
      panningY: 0,
      translateX: 0,
      translateY: 0,
      width: 0,
      height: 0,
      initialWidth: 0,
      initialHeight: 0,
      srcWidth: 0,
      srcHeight: 0,
      ratio: 0,
    }

    this.panning = false

    this.originPanningX = 0
    this.originPanningY = 0

    this.deltaPanningX = 0
    this.deltaPanningY = 0

    this.frictionX = 1.0
    this.frictionY = 1.0

    this.directionX = null
    this.directionY = null

    this.leftEdge = 0
    this.rightEdge = 0
    this.topEdge = 0
    this.bottomEdge = 0

    this.leftEdgeMax = 0
    this.rightEdgeMax = 0
    this.topEdgeMax = 0
    this.bottomEdgeMax = 0

    this.animatedX = new Animated.Value(0)
    this.animatedY = new Animated.Value(0)

    this.snapAnimation = null

    this.originTranslateX = 0
    this.originTranslateY = 0

    this.scaling = false
    this.deltaScaling = 0

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        this.onLongPressTimeout = setTimeout(() => {
          this.setState({ selected: true }, () => {
            this.props.translationStartCallback(this)
          })
        }, props.longPressDelay)
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          panningX,
          panningY,
          width,
          height,
          initialWidth,
          initialHeight,
          ratio,
        } = this.state
        const { scaleAmplifier, longPressSensitivity } = this.props
        const { relativeContainerWidth, relativeContainerHeight } =
          this.props.boundaries

        const moveX = gestureState.moveX
        const moveY = gestureState.moveY

        //INTERRUPT ANIMATIONS
        if (this.snapAnimation != null) {
          this.setState({
            animating: false,
            panningX: this.animatedX._value,
            panningY: this.animatedY._value,
          })

          this.snapAnimation.stop()
          this.snapAnimation = null
        }

        if (gestureState.numberActiveTouches == 1) {
          if (!this.state.animating) {
            if (!this.panning) {
              this.panning = true

              this.originPanningX = moveX
              this.originPanningY = moveY

              this.originTranslateX = moveX
              this.originTranslateY = moveY

              this.deltaPanningX = this.originPanningX - moveX
              this.deltaPanningY = this.originPanningY - moveY
            } else {
              if (!this.state.selected) {
                const { frictionX, frictionY } = this.calculateFriction(
                  panningX,
                  panningY
                )

                const panningMovementX = this.originPanningX - moveX
                const panningMovementY = this.originPanningY - moveY

                this.directionX =
                  this.deltaPanningX - panningMovementX > 0 ? 'right' : 'left'
                this.directionY =
                  this.deltaPanningY - panningMovementY > 0 ? 'down' : 'up'

                const incrementX =
                  (this.deltaPanningX - panningMovementX) * frictionX
                const incrementY =
                  (this.deltaPanningY - panningMovementY) * frictionY

                const newPanningX = panningX - incrementX
                const newPanningY = panningY - incrementY

                const longPressCancelSensitivity = 10 * longPressSensitivity

                if (
                  Math.abs(panningMovementX) > longPressCancelSensitivity ||
                  Math.abs(panningMovementY) > longPressCancelSensitivity
                )
                  if (this.onLongPressTimeout)
                    clearTimeout(this.onLongPressTimeout)

                this.setState({ panningX: newPanningX, panningY: newPanningY })

                this.deltaPanningX = panningMovementX
                this.deltaPanningY = panningMovementY
              } else {
                const translateX = this.originTranslateX - moveX
                const translateY = this.originTranslateY - moveY

                this.props.translationUpdateCallback(this)

                this.setState({ translateX, translateY })
              }
            }
          }
        } else if (gestureState.numberActiveTouches == 2) {
          const touches = evt.touchHistory.touchBank.filter(
            (item) => item !== null || item !== undefined
          )
          const touchOne = touches[0]
          const touchTwo = touches[1]

          const scalingValue = Math.max(
            Math.abs(touchOne.currentPageX - touchTwo.currentPageX),
            Math.abs(touchOne.currentPageY - touchTwo.currentPageY)
          )

          if (this.onLongPressTimeout) clearTimeout(this.onLongPressTimeout)

          if (!this.scaling) {
            this.scaling = true

            this.deltaScaling = scalingValue
          } else {
            const incrementScaling =
              (this.deltaScaling - scalingValue) * scaleAmplifier

            const incrementScalingWidth =
              initialWidth > initialHeight
                ? incrementScaling * ratio
                : incrementScaling
            const incrementScalingHeight =
              initialHeight > initialWidth
                ? incrementScaling * ratio
                : incrementScaling

            const newWidth = width - incrementScalingWidth
            const newHeight = height - incrementScalingHeight

            if (
              (newWidth > relativeContainerWidth &&
                height > relativeContainerHeight) ||
              incrementScaling < 0
            ) {
              const anchorRelativePercentageX =
                ((moveX - this.props.collageOffsetX) / relativeContainerWidth) *
                100
              const anchorRelativePercentageY =
                ((moveY - this.props.collageOffsetY) /
                  relativeContainerHeight) *
                100

              const anchorPointX = Math.max(
                1,
                (3 * anchorRelativePercentageX) / 100
              )
              const anchorPointY = Math.max(
                1,
                (3 * anchorRelativePercentageY) / 100
              )

              const anchorPanningX =
                panningX - (width - newWidth) / anchorPointX
              const anchorPanningY =
                panningY - (height - newHeight) / anchorPointY

              this.setState({
                width: newWidth,
                height: newHeight,
                panningX: anchorPanningX,
                panningY: anchorPanningY,
              })
            }

            this.deltaScaling = scalingValue
          }
        }
      },
      onPanResponderEnd: (e, gestureState) => {
        this.panning = false
        this.scaling = false

        if (this.onLongPressTimeout) clearTimeout(this.onLongPressTimeout)

        if (this.state.selected) {
          this.props.translationEndCallback(this)
          this.setState({ selected: false, translateX: 0, translateY: 0 })
        }

        this.calculateImagePosition()
      },
    })

    this.calculateImageSize()
  }

  componentDidUpdate(prevProps) {
    const {
      matrix,
      direction,
      boundaries,
      panningLeftPadding,
      panningRightPadding,
      panningTopPadding,
      panningBottomPadding,
    } = this.props
    const { width, height } = this.state

    this.leftEdge = 0
    this.rightEdge = width - (boundaries.ux - boundaries.lx)
    this.topEdge = 0
    this.bottomEdge = height - (boundaries.uy - boundaries.ly)

    this.leftEdgeMax = this.leftEdge - panningLeftPadding
    this.rightEdgeMax = this.rightEdge + panningRightPadding
    this.topEdgeMax = this.topEdge - panningTopPadding
    this.bottomEdgeMax = this.bottomEdge + panningBottomPadding

    if (matrix !== prevProps.matrix || direction !== prevProps.direction) {
      if (this.snapAnimation != null) {
        this.snapAnimation.stop()
        this.snapAnimation = null
      }

      this.setState({
        panningX: 0,
        panningY: 0,
      })

      this.calculateImageSize()
    }
  }

  componentWillUnmount() {
    if (this.onLongPressTimeout) clearTimeout(this.onLongPressTimeout)
  }

  calculateFriction(x, y) {
    let frictionX = 1.0
    let frictionY = 1.0

    if (x < this.leftEdge && this.directionX === 'right') {
      frictionX = Math.max(
        0,
        (x - this.leftEdgeMax) / (this.leftEdge - this.leftEdgeMax)
      )
    }

    if (x > this.rightEdge && this.directionX === 'left') {
      frictionX = Math.max(
        0,
        (x - this.rightEdgeMax) / (this.rightEdge - this.rightEdgeMax)
      )
    }

    if (y < this.topEdge && this.directionY === 'down') {
      frictionY = Math.max(
        0,
        (y - this.topEdgeMax) / (this.topEdge - this.topEdgeMax)
      )
    }

    if (y > this.bottomEdge && this.directionY === 'up') {
      frictionY = Math.max(
        0,
        (y - this.bottomEdgeMax) / (this.bottomEdge - this.bottomEdgeMax)
      )
    }

    return { frictionX, frictionY }
  }

  /**
   * Updates the image postion, will use animation to snap the image into place if it is out of bounds
   */
  calculateImagePosition() {
    const { panningX, panningY } = this.state

    this.setState({ animating: true })

    this.animatedX.setValue(panningX)
    this.animatedY.setValue(panningY)

    let animateXTo = this.animatedX._value
    let animateYTo = this.animatedY._value
    if (panningX < this.leftEdge) {
      animateXTo = this.leftEdge
    }
    if (panningX > this.rightEdge) {
      animateXTo = this.rightEdge
    }
    if (panningY < this.topEdge) {
      animateYTo = this.topEdge
    }
    if (panningY > this.bottomEdge) {
      animateYTo = this.bottomEdge
    }

    if (
      animateXTo != this.animatedX._value ||
      animateYTo != this.animatedY._value
    ) {
      this.snapAnimation = Animated.parallel([
        Animated.spring(this.animatedX, {
          toValue: animateXTo,
          duration: 100,
        }),
        Animated.spring(this.animatedY, {
          toValue: animateYTo,
          duration: 100,
        }),
      ])

      this.snapAnimation.start(() => {
        this.setState({ animating: false, panningX: animateXTo })
      })
    } else {
      this.setState({ animating: false })
    }
  }

  /**
   * Calculates the size of the image. This includes width, height, intial size and source size.
   *
   * @param targetWidth {number} target width to overwrite the width to be calculated
   * @param targetHeight {number} target height to overwite the height to be calculated
   * @param keepScale {bool} Keeps the scale of the image, does not try to adjust to container size
   */
  calculateImageSize(
    targetWidth = null,
    targetHeight = null,
    keepScale = false
  ) {
    Image.getSize(this.props.source.uri, (width, height) => {
      const { imageWidth, imageHeight } = this.calculateAspectRatioFit(
        targetWidth ? targetWidth : width,
        targetHeight ? targetHeight : height,
        this.props.boundaries.relativeContainerWidth,
        this.props.boundaries.relativeContainerHeight,
        keepScale
      )

      this.setState(
        {
          width: imageWidth,
          height: imageHeight,
          initialWidth: imageWidth,
          initialHeight: imageHeight,
          srcWidth: width,
          srcHeight: height,
          ratio: Math.max(imageHeight / imageWidth, imageWidth / imageHeight),
        },
        () => {
          this.calculateImagePosition()
        }
      )
    })
  }

  /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area. We use Math.max becuase we don't want
   * the image to resize smaller than the container.
   *
   * @param {Number} srcWidth width of source image
   * @param {Number} srcHeight height of source image
   * @param {Number} maxWidth maximum available width
   * @param {Number} maxHeight maximum available height
   * @param {Bool} Keeps the scale of the image
   *
   * @return {Object} { imageWidth, imageHeight }
   */
  calculateAspectRatioFit(
    srcWidth,
    srcHeight,
    maxWidth,
    maxHeight,
    keepScale = false
  ) {
    const newMaxWidth = keepScale ? Math.max(srcWidth, maxWidth) : maxWidth
    const newMaxHeight = keepScale ? Math.max(srcHeight, maxHeight) : maxHeight

    const ratio = Math.max(newMaxWidth / srcWidth, newMaxHeight / srcHeight)
    return { imageWidth: srcWidth * ratio, imageHeight: srcHeight * ratio }
  }

  /**
   * Method triggered when image has been swapped
   *
   * @param image - A CollageImage class
   */
  imageSwapped(image) {
    const { retainScaleOnSwap } = this.props

    let targetImagePanningX = image.state.panningX
    let targetImagePanningY = image.state.panningY
    const targetImageWidth = image.state.width
    const targetImageHeight = image.state.height

    if (targetImagePanningX < this.leftEdge) {
      targetImagePanningX = this.leftEdge
    }
    if (targetImagePanningX > this.rightEdge) {
      targetImagePanningX = this.rightEdge
    }
    if (targetImagePanningY < this.topEdge) {
      targetImagePanningY = this.topEdge
    }
    if (targetImagePanningY > this.bottomEdge) {
      targetImagePanningY = this.bottomEdge
    }

    this.calculateImageSize(
      targetImageWidth,
      targetImageHeight,
      retainScaleOnSwap
    )

    this.setState({
      panningX: targetImagePanningX,
      panningY: targetImagePanningY,
    })
  }

  render() {
    const { source, style, imageSelectedStyle } = this.props
    const {
      panningX,
      panningY,
      translateX,
      translateY,
      width,
      height,
      selected,
      animating,
    } = this.state

    const right = animating ? this.animatedX : panningX
    const bottom = animating ? this.animatedY : panningY

    return (
      <View
        ref={'imageContainer'}
        style={{
          flex: 1,
          overflow: 'hidden',
          transform: [{ translateX: -translateX }, { translateY: -translateY }],
          borderWidth: 2,
          borderColor: 'white',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: width,
            height: height,
          }}
          {...this._panResponder.panHandlers}
        >
          <Animated.Image
            ref={'image'}
            source={source}
            style={[
              style,
              { right, bottom, width, height },
              selected ? imageSelectedStyle : null,
            ]}
            resizeMode='cover'
          />
        </View>
      </View>
    )
  }
}

CollageImage.propTypes = {
  panningLeftPadding: PropTypes.number.isRequired,
  panningRightPadding: PropTypes.number.isRequired,
  panningTopPadding: PropTypes.number.isRequired,
  panningBottomPadding: PropTypes.number.isRequired,
  scaleAmplifier: PropTypes.number.isRequired,
  retainScaleOnSwap: PropTypes.bool,
  longPressDelay: PropTypes.number,
  longPressSensitivity: PropTypes.number,
}

export default CollageImage
