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

  /**
   * Returns the tile dimensions based on current size. These are rounded to
   * the nearest integer to prevent unevenly sized sprites. There's also
   * row height, which is different than tile height because rows overlap by
   * one fourth in order to get the tiles match rows above and below.
   */
  public getTileDimensions = (size: number) => {
    const tileHeight = size * 2 * Math.cos((this.tilt * Math.PI) / 180);
    const tileWidth = Math.round(size * Math.sqrt(3));
    return {
      tileWidth,
      tileHeight,
      rowHeight: tileHeight * 0.75,
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
  public getScale = (fromSize: number, toSize: number) => {
    const {
      tileWidth: fromTileWidth,
      tileHeight: fromTileHeight,
    } = this.getTileDimensions(fromSize);
    const {
      tileWidth: toTileWidth,
      tileHeight: toTileHeight,
    } = this.getTileDimensions(toSize);
    return {
      scaleX: toTileWidth / fromTileWidth,
      scaleY: toTileHeight / fromTileHeight,
    };
  };

  /**
   * Returns the size of borders around the map. Override this to use
   * a different border sizes.
   */
  public getBorderDimensions = (size: number) => {
    const { tileWidth, rowHeight } = this.getTileDimensions(size);
    return {
      borderWidth: tileWidth * 2,
      borderHeight: rowHeight * 2,
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
  public getMapBoundaries = (
    size: number,
    map: Dimensions,
    screen: Dimensions
  ) => {
    const { borderWidth, borderHeight } = this.getBorderDimensions(size);
    const { tileWidth, rowHeight } = this.getTileDimensions(size);
    return {
      maxX: borderWidth,
      minX: tileWidth * -(map.width - 0.5) + (screen.width - borderWidth),
      maxY: borderHeight,
      minY: rowHeight * -(map.height - 0.5) + (screen.height - borderHeight),
    };
  };

  /**
   * Returns the pixel boundaries of the current view on the map container.
   * Note that these are actual pixels, not the tiles. You need to calculate
   * which tiles are visible in these boundaries knowing their size.
   */
  public getViewBoundaries = (map: Position, screen: Dimensions) => ({
    minX: -map.x,
    maxX: -map.x + screen.width,
    minY: -map.y,
    maxY: -map.y + screen.height,
  });

  /**
   * Calculates which tiles are visible inside specified boundaries and returns
   * their index ranges.
   */
  public getTileIndexBoundaries = (
    size: number,
    { minX, maxX, minY, maxY }: Boundaries
  ) => {
    const { tileWidth, rowHeight } = this.getTileDimensions(size);

    const minXIndex = Math.floor(minX / tileWidth - 0.5);
    const maxXIndex = Math.ceil(maxX / tileWidth);

    const minYIndex = Math.floor(minY / rowHeight - 0.5);
    const maxYIndex = Math.ceil(maxY / rowHeight);

    return { minXIndex, maxXIndex, minYIndex, maxYIndex };
  };

  /**
   * Returns the pixel coordinates of a tile with specified index, withing the
   * map container. These are adjusted so that the center of 0,0 tile is
   * at 0,0 pixel.
   */
  public getTileCoordinates = (
    size: number,
    xIndex: number,
    yIndex: number
  ) => {
    const { tileWidth, rowHeight } = this.getTileDimensions(size);

    // odd rows get half a width of horizontal offset to achieve tiling effect
    const offset = yIndex % 2 !== 0 ? 0.5 : 0;

    const tileY = rowHeight * (yIndex - 0.5);
    const tileX = tileWidth * (xIndex + offset - 0.5);

    return { tileX, tileY };
  };
}
