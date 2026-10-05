import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function ForceFBD({show}) {

    const func = (x) => x;
    return (
        <div>
            {show === "isRamp" && (
                <div className="FBD-container">
                    <Mafs>
                        <Coordinates.Cartesian

                        />
                        <Plot.OfX
                            y = {func}
                        />
                        <Text>
                            <Text x={0} y={0}>X</Text>
                        </Text>
                    </Mafs>
                </div>
            )}

        </div>
    );
}
export default ForceFBD