import { Path, Svg } from "@react-pdf/renderer";
import { CLAIM_DEFENDER_MARK_PATH } from "./claim-defender-path";

export function ClaimDefenderPdfMark({ inverted = false, size = 28 }: { inverted?: boolean; size?: number }) {
    return (
        <Svg viewBox="0 0 388 388" style={{ width: size, height: size }}>
            <Path d={CLAIM_DEFENDER_MARK_PATH} fill={inverted ? "#F8F9F5" : "#333629"} />
        </Svg>
    );
}

