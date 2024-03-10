// configurables
export const DEFAULT = {
    _FoodRadius: 15,
    _FoodSpawnPadding: 50,
    _BallRadius: 50,
    _Gravity: 0.5,
    _Friction: 0.65,
    _SpeedFactor: 0.5,   // determines launch speed
    _TotalFood: 4,
    _BoundRadius: 120,   // determines how far you can pull the sling
    get FoodRadius(): number {
        return this._FoodRadius;
    },
    get FoodSpawnPadding(): number {
        return this._FoodSpawnPadding;
    },
    get BallRadius(): number {
        return this._BallRadius;
    },
    get Gravity(): number {
        return this._Gravity;
    },
    get Friction(): number {
        return this._Friction;
    },
    get SpeedFactor(): number {
        return this._SpeedFactor;
    },
    get TotalFood(): number {
        return this._TotalFood;
    },
    get BoundRadius(): number {
        return this._BoundRadius;
    },
};