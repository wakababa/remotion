---
image: /generated/articles-docs-motion-blur-camera-motion-blur.png
title: "<CameraMotionBlur>"
slug: camera-motion-blur
crumb: "Realistic camera effect"
---

import { CameraMotionBlurExample } from "../../components/CameraMotionBlurExample/CameraMotionBlurExample";

```twoslash include example
const RainbowSquare: React.FC = () => <div></div>
// - RainbowSquare
```

_available from v3.2.39_

The `<CameraMotionBlur>` produces natural looking motion blur similar to what would be produced by
a film camera.

For this technique to work, the children must be absolutely positioned so many layers can be created without influencing the layout.  
You can use the [`<AbsoluteFill>`](/docs/absolute-fill) component to absolutely position content.

:::note
The technique is destructive to colors. It is recommended to keep the `samples` property as low as
possible and carefully inspect that the output is of acceptable quality.
:::

## API

Wrap your content in `<CameraMotionBlur>` and optionally add the following props in addition.

### `shutterAngle`

_optional - default: `180`_

Controls the amount of blur.

A lower value will result in less blur and a higher value will result in more.

The blur also depends on the frames per second (FPS). Higher FPS will naturally have less blur and
lower FPS will have more blur.

In movies and TV common values are (FPS/shutter angle):

- 24 fps / 180&deg; or 90&deg;
- 25 fps / 180&deg; or 90&deg;
- 30 fps / 180&deg; or 90&deg;
- 50 fps / 180&deg; or 90&deg;
- 60 fps / 180&deg; or 90&deg;

<details>
<summary>What is "shutter angle"?
</summary>
Many analog film cameras use rotating discs with partial cut-outs to block or let light through to
expose the analog film. Zero degrees is equal to completely blocking the light, and 360 degrees is
the same as not blocking any light at all.

The most common values used in the film industry are 90 and 180 degrees. These values are the same
as what you've experienced in most movies.

Read more here: [Rotary disc shutter on Wikipedia](https://en.wikipedia.org/wiki/Rotary_disc_shutter)

</details>

### `samples`

_optional - default: `10`_

The final image is an average of the samples. For a value of `10` the component will render ten
frames with different time offsets and combine them into a final image.

:::caution
A high number will produce a higher quality blur at the cost of image quality. See example below.

Recommended values: 5-10.
:::

## Example usage

```tsx twoslash
// @include: example-RainbowSquare
// ---cut---
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill } from "remotion";

export const MyComposition = () => {
  return (
    <CameraMotionBlur shutterAngle={180} samples={10}>
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RainbowSquare />
      </AbsoluteFill>
    </CameraMotionBlur>
  );
};
```

## Demo

<CameraMotionBlurExample />

## Credits

The technique was developed by [@marcusstenbeck](https://twitter.com/marcusstenbeck) and inspired by
the `<Trail>` component developed by [@UmungoBungo](https://github.com/UmungoBungo).

## See also

- [Source code for this component](https://github.com/remotion-dev/remotion/blob/main/packages/motion-blur/src/CameraMotionBlur.tsx)
