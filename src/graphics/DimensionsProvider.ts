/**
 * Represents something that is contained in a rectangle of a size, but not
 * attached to any actual position.
 */
interface Dimensions {
  width: number;
  height: number;
}

/**
 * Represents some position. This is basically a point, but we don't want to
 * call this interface a "Point".
 */
interface Position {
  x: number;
  y: number;
}

interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Dimensions calculates various coordinates for the map and the screen, based
 * on provided size. It's the only source of truth - don't perform 2D calculations
 * outside of Dimensions.
 */
export default class DimensionsProvider {
  /**
   * Camera tilt in degrees, away from straight down.
   */
  private readonly tilt = 30;

  private size = 1;
  private screenWidth = 1;
  private screenHeight = 1;
  private mapWidth = 1;
  private mapHeight = 1;
  private posX = 1;
  private posY = 1;

  /**
   * Sets the base size of the view.
   */
  public setSize = (size: number) => {
    this.size = size;
  };

  /**
   * Sets the screen dimensions (in pixels).
   */
  public setScreen = (width: number, height: number) => {
    this.screenWidth = width;
    this.screenHeight = height;
  };

  /**
   * Sets the dimensions of the map (in tiles).
   */
  public setMap = (width: number, height: number) => {
    this.mapWidth = width;
    this.mapHeight = height;
  };

  /**
   * Sets the position of the map container (in pixels).
   */
  public setPosition = (x: number, y: number) => {
    this.posX = x;
    this.posY = y;
  };

  /**
   * Returns the tile dimensions based on current size. These are rounded to
   * the nearest integer to prevent unevenly sized sprites.
   */
  public getTileDimensions = (size = this.size): Dimensions => {
    const realWidth = size * Math.sqrt(3);
    const width = Math.round(realWidth);
    const change = width / realWidth;
    const height = change * (size * 2 * Math.cos((this.tilt * Math.PI) / 180));
    return {
      width,
      height,
    };
  };

  /**
   * Returns the dimensions of a single cell in the map. This is different
   * than tile size because rows overlap by one fourth in order to get
   * the tiles match rows above and below.
   */
  public getCellDimensions = (size = this.size): Dimensions => {
    const { width, height } = this.getTileDimensions(size);
    return {
      width,
      height: height * 0.75,
    };
  };

  /**
   * Calculates scale difference between two sizes. This is not the same as
   * simply dividing them since tile dimensions are not exactly matching
   * the current size.
   *
   * @param fromSize this is the size that you are starting with and want to
   *                 modify
   * @param toSize   this is the size you want to achieve
   *
   * @returns an object with scales for both x and y axes
   *          (they can be slightly different)
   */
  public getScale = (toSize: number) => {
    const {
      width: fromTileWidth,
      height: fromTileHeight,
    } = this.getTileDimensions(this.size);
    const { width: toTileWidth, height: toTileHeight } = this.getTileDimensions(
      toSize
    );
    return {
      scaleX: toTileWidth / fromTileWidth,
      scaleY: toTileHeight / fromTileHeight,
    };
  };

  /**
   * Returns the size of borders around the map. Override this to use
   * a different border sizes.
   */
  public getBorderDimensions = (): Dimensions => {
    const { width, height } = this.getCellDimensions();
    return {
      width: width * 2,
      height: height * 2,
    };
  };

  /**
   * Returns the boundaries of map as maximum and minimum values of the position
   * of the map container (which is anchored to its upper-left corner). Positive
   * x and y mean that it's moved towards south east, so the camera appears to
   * move in towards north west. It's a bit counterintuitive, but we don't have
   * any actual camera abstraction.
   *
   * Boundaries are used to determine whether the map container can move to
   * a position.
   */
  public getMapBoundaries = (): Boundaries => {
    const {
      width: borderWidth,
      height: borderHeight,
    } = this.getBorderDimensions();
    const { width, height } = this.getCellDimensions();
    return {
      maxX: borderWidth,
      minX: width * -(this.mapWidth - 0.5) + (this.screenWidth - borderWidth),
      maxY: borderHeight,
      minY:
        height * -(this.mapHeight - 0.5) + (this.screenHeight - borderHeight),
    };
  };

  /**
   * Returns the pixel boundaries of the current view on the map container.
   * Note that these are actual pixels, not the tiles. You need to calculate
   * which tiles are visible in these boundaries knowing their size.
   */
  public getViewBoundaries = (): Boundaries => ({
    minX: -this.posX,
    maxX: -this.posX + this.screenWidth,
    minY: -this.posY,
    maxY: -this.posY + this.screenHeight,
  });

  /**
   * Calculates which tiles are visible inside specified boundaries and returns
   * their index ranges.
   */
  public getTileIndexBoundaries = (): Boundaries => {
    const { minX, maxX, minY, maxY } = this.getViewBoundaries();
    const { width, height } = this.getCellDimensions();
    return {
      minX: Math.floor(minX / width - 0.5),
      maxX: Math.ceil(maxX / width),
      minY: Math.floor(minY / height - 0.5),
      maxY: Math.ceil(maxY / height),
    };
  };

  /**
   * Returns the pixel coordinates of a tile with specified index, withing the
   * map container. These are adjusted so that the center of 0,0 tile is
   * at 0,0 pixel.
   */
  public getTileCoordinates = (xIndex: number, yIndex: number): Position => {
    const { width, height } = this.getCellDimensions();
    // odd rows get half a width of horizontal offset to achieve tiling effect
    const offset = yIndex % 2 !== 0 ? 0.5 : 0;
    const x = width * (xIndex + offset);
    const y = height * yIndex;
    return { x, y };
  };

  public toLocalPoint = (global: Position): Position => {
    const result = {
      x: global.x - this.posX,
      y: global.y - this.posY,
    };
    return result;
  };

  public toGlobalPoint = (local: Position): Position => {
    const result = {
      x: local.x + this.posX,
      y: local.y + this.posY,
    };
    return result;
  };

  public toHex = (local: Position): Position => {
    const { x, y } = local;
    const { height: tileHeight, width: tileWidth } = this.getTileDimensions();
    const { height: cellHeight, width: cellWidth } = this.getCellDimensions();
    const row = (y + tileHeight / 2) / cellHeight;
    const rowY = Math.floor(row);
    const oddRow = rowY % 2 === 1;
    const col = (x + tileWidth / 2 - (oddRow ? tileWidth / 2 : 0)) / cellWidth;
    const colX = Math.floor(col);
    const rowFraction = row - rowY;
    const colFraction = col - colX;

    // point was in the square part of the hexagon, easy
    if (rowFraction > 1 / 3) {
      return { x: colX, y: rowY };
    }

    // point was in the place where three hexagons meet
    if (colFraction < 0.5) {
      // this is the left half of the hexagon
      const side = Math.sign((2 * colFraction - 1) / 3 + rowFraction);
      if (side > 0) {
        // this is still the same hex
        return { x: colX, y: rowY };
      } else {
        // this is hex at north-west direction
        if (oddRow) {
          return { x: colX, y: rowY - 1 };
        } else {
          return { x: colX - 1, y: rowY - 1 };
        }
      }
    } else {
      // this is the right half of the hexagon
      const side = Math.sign((-2 * colFraction + 1) / 3 + rowFraction);
      if (side > 0) {
        // this is still the same hex
        return { x: colX, y: rowY };
      } else {
        // this is hex at north-east direction
        if (oddRow) {
          return { x: colX + 1, y: rowY - 1 };
        } else {
          return { x: colX, y: rowY - 1 };
        }
      }
    }
  };
}
