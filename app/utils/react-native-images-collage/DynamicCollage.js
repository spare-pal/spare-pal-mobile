import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import CollageImage from './CollageImage'

class DynamicCollage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      images: props.images,
      collageWidth: null,
      collageHeight: null,
      collageOffsetX: null,
      collageOffsetY: null,
    }
  }

  renderMatrix() {
    const {
      matrix,
      direction,
      retainScaleOnSwap,
      longPressDelay,
      longPressSensitivity,
    } = this.props
    const { collageOffsetX, collageOffsetY } = this.state

    const sectionDirection = direction === 'row' ? 'column' : 'row'
    const reducer = (accumulator, currentValue) => accumulator + currentValue

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0

      const images = this.state.images
        .slice(startIndex, startIndex + element)
        .map((image, i) => {
          const source = Number.isInteger(image)
            ? Image.resolveAssetSource(image)
            : { uri: image }

          return (
            <CollageImage
              key={i}
              ref={`image${m}-${i}`}
              source={source}
              style={[{ flex: 1 }, this.props.imageStyle]}
              boundaries={this.getImageBoundaries(m, i)}
              translationStartCallback={this.imageTranslationStart.bind(this)}
              translationUpdateCallback={this.imageTranslationUpdate.bind(this)}
              translationEndCallback={this.imageTranslationEnd.bind(this)}
              matrixId={m}
              imageId={`image${m}-${i}`}
              imageSelectedStyle={this.props.imageSelectedStyle}
              panningLeftPadding={this.props.panningLeftPadding}
              panningRightPadding={this.props.panningRightPadding}
              panningTopPadding={this.props.panningTopPadding}
              panningBottomPadding={this.props.panningBottomPadding}
              scaleAmplifier={this.props.scaleAmplifier}
              retainScaleOnSwap={retainScaleOnSwap}
              longPressDelay={longPressDelay}
              matrix={matrix}
              direction={direction}
              longPressSensitivity={longPressSensitivity}
              collageOffsetX={collageOffsetX}
              collageOffsetY={collageOffsetY}
            />
          )
        })

      return (
        <View
          key={m}
          ref={`matrix${m}`}
          style={{ flex: 1, flexDirection: sectionDirection }}
        >
          {images}
        </View>
      )
    })
  }

  render() {
    const { width, height, matrix, direction, containerStyle } = this.props
    const { images, collageWidth, collageHeight } = this.state

    if (matrix.reduce((a, b) => a + b, 0) !== images.length) {
      throw new Error(
        'Number of images must be equal to sum of matrix. E.g. Matrix = [ 1, 2 ] = 3. Images.length = 3 '
      )
    }

    return (
      <View
        style={[{ width, height }, containerStyle]}
        onLayout={(event) => {
          this.setState({
            collageWidth: event.nativeEvent.layout.width,
            collageHeight: event.nativeEvent.layout.height,
            collageOffsetX: event.nativeEvent.layout.x,
            collageOffsetY: event.nativeEvent.layout.y,
          })
        }}
      >
        <View style={{ flex: 1, flexDirection: direction }}>
          {collageWidth !== null && collageHeight !== null
            ? this.renderMatrix()
            : null}
        </View>
      </View>
    )
  }

  imageTranslationStart(selectedImage) {
    const { matrix } = this.props
    const { images } = this.state
    const { matrixId, imageId } = selectedImage.props
    const reducer = (accumulator, currentValue) => accumulator + currentValue

    matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0

      this.refs[`matrix${m}`].setNativeProps({ zIndex: 1 })

      images.slice(startIndex, startIndex + element).map((image, i) => {
        this.refs[`image${m}-${i}`].refs['imageContainer'].setNativeProps({
          zIndex: 1,
        })
      })
    })

    this.refs[`matrix${matrixId}`].setNativeProps({ zIndex: 999 })

    this.refs[imageId].refs['imageContainer'].setNativeProps({ zIndex: 999 })
  }

  imageTranslationUpdate(selectedImage) {
    const targetImageId = this.isImageInBoundaries(selectedImage)

    if (typeof targetImageId === 'string') {
      this.refs[targetImageId].refs['imageContainer'].setNativeProps({
        style: this.props.imageSwapStyle,
      })
    }
  }

  imageTranslationEnd(selectedImage) {
    const { images } = this.state
    const targetImageId = this.isImageInBoundaries(selectedImage)

    if (typeof targetImageId === 'string') {
      const targetImage = this.refs[targetImageId]

      const reorderedImages = images.slice()
      const index1 = images.findIndex((image) =>
        this.imageFindIndex(image, selectedImage)
      )
      const index2 = images.findIndex((image) =>
        this.imageFindIndex(image, targetImage)
      )

      reorderedImages[index1] = images[index2]
      reorderedImages[index2] = images[index1]

      this.setState({ images: reorderedImages })

      selectedImage.imageSwapped(targetImage)
      targetImage.imageSwapped(selectedImage)
    }
  }

  isImageInBoundaries(selectedImage) {
    const { matrix, separatorStyle } = this.props
    const { images } = this.state
    const { translateX, translateY } = selectedImage.state
    const { lx, ly, relativeContainerWidth, relativeContainerHeight } =
      selectedImage.props.boundaries

    let targetImageId = null

    const reducer = (accumulator, currentValue) => accumulator + currentValue

    matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0

      images.slice(startIndex, startIndex + element).map((image, i) => {
        this.refs[`image${m}-${i}`].refs['imageContainer'].setNativeProps({
          style: { ...this.props.imageResetStyle, ...separatorStyle },
        })

        if (selectedImage.props.imageId !== `image${m}-${i}`) {
          const targetBoundaries = this.getImageBoundaries(m, i)

          const imagePositionX = lx + relativeContainerWidth / 2 - translateX
          const imagePositionY = ly + relativeContainerHeight / 2 - translateY

          if (
            imagePositionX > targetBoundaries.lx &&
            imagePositionX < targetBoundaries.ux &&
            imagePositionY > targetBoundaries.ly &&
            imagePositionY < targetBoundaries.uy
          ) {
            targetImageId = `image${m}-${i}`
          }
        }
      })
    })

    return targetImageId
  }

  /**
   * Finds the index of a image, either URL or `required`.
   *
   * @param image
   * @param targetImage
   *
   * @return int
   */
  imageFindIndex(image, targetImage) {
    const imageResolved = Number.isInteger(image)
      ? Image.resolveAssetSource(image).uri
      : image
    return imageResolved === targetImage.refs['image'].props.source.uri
  }

  /**
   * Function used to calculate the lower and upper bounds of an image in the collage.
   *
   * @param m {number} - matrix index
   * @param i {number} - images index
   * @return {object}
   */
  getImageBoundaries(m, i) {
    const { matrix, direction } = this.props
    const { collageWidth, collageHeight } = this.state

    const relativeContainerWidth =
      direction === 'row'
        ? collageWidth / matrix.length
        : collageWidth / matrix[m]
    const relativeContainerHeight =
      direction === 'row'
        ? collageHeight / matrix[m]
        : collageHeight / matrix.length

    const boundries =
      direction === 'row'
        ? {
            lx: relativeContainerWidth * m,
            ly: relativeContainerHeight * i,
            ux: relativeContainerWidth * (m + 1),
            uy: relativeContainerHeight * (i + 1),
          }
        : {
            lx: relativeContainerWidth * i,
            ly: relativeContainerHeight * m,
            ux: relativeContainerWidth * (i + 1),
            uy: relativeContainerHeight * (m + 1),
          }

    return { ...boundries, relativeContainerWidth, relativeContainerHeight }
  }
}

DynamicCollage.defaultProps = {
  direction: 'row',
  panningLeftPadding: 15,
  panningRightPadding: 15,
  panningTopPadding: 15,
  panningBottomPadding: 15,
  scaleAmplifier: 1.0,
  retainScaleOnSwap: true,
  longPressDelay: 500,
  longPressSensitivity: 3,

  containerStyle: {
    borderWidth: 4,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  imageStyle: {},

  separatorStyle: {
    borderWidth: 2,
    borderColor: 'white',
  },

  imageSelectedStyle: {
    opacity: 0.6,
  },

  imageSwapStyle: {
    borderColor: '#EB4A4A',
    borderWidth: 4,
  },
  imageSwapStyleReset: {
    borderWidth: 0,
  },
}

DynamicCollage.propTypes = {
  images: PropTypes.array,
  matrix: PropTypes.array,
  direction: PropTypes.oneOf(['row', 'column']),
  panningLeftPadding: PropTypes.number,
  panningRightPadding: PropTypes.number,
  panningTopPadding: PropTypes.number,
  panningBottomPadding: PropTypes.number,
  scaleAmplifier: PropTypes.number,
  retainScaleOnSwap: PropTypes.bool,
  longPressDelay: PropTypes.number,
  longPressSensitivity: PropTypes.number,
}

export { DynamicCollage }
