# The Cluma monsters: reference library for image generation

Ten characters, 50 reference renders, cropped from Chris's website slides on 22.09.2026.
`index.json` lists the files per monster. Served by jsDelivr, pinned to a tag:

    https://cdn.jsdelivr.net/gh/cbogatzki/cluma-assets@<tag>/monsters/<name>/<name>-NN.jpg

**These are the only valid likenesses.** A monster that is not in this library does not exist,
and a "similar" fluffy creature is wrong. Every one is a photoreal 3D character render.

## How to use them in a generation prompt (the rules, from Chris)

1. **Pick the monsters by character, not by count.** One to three per image, chosen because
   their personality fits what the post is about. Never all ten unless the image is about the
   whole team. Their relationship to each other has to be readable in the scene (see below).
2. **Attach several reference renders of the SAME monster, in different poses**, so the model
   knows exactly how it looks from more than one angle. Three to five per chosen monster.
3. **Say explicitly that the reference background is not the scene.** The renders sit on the
   website's pink gradient with a floor shadow and sometimes a fragment of headline text. Put a
   sentence like this in every prompt: *"The reference images define the characters only. Their
   pink gradient background, floor shadow and any text fragments are not part of the image to
   create; build the scene described below instead."*
4. **Calm scene, calm palette (Chris, 22.09.).** Office and workplace settings are the default:
   a meeting room, a desk, a whiteboard, the kitchen. Muted neutrals, soft daylight. No neon, no
   glowing surfaces, no coloured light on the walls, no gradient backdrop, and no flat cream or
   beige fill either. Brand colour (purple #a344ab, pink #e199ff) enters ONLY through the props
   and the monsters: a bar-chart block, a sticky note, a mug, a chair.
7. **Model settings that hold the likeness:** Higgsfield `gpt_image_2_5` with `quality: "max"`
   and `resolution: "2k"`. The default quality (`low`) and Nano Banana Pro both drifted from
   the references in the 22.09. test; `max` reproduced Grizzle, Mumble and Noodle 1:1.
5. **Keep the characters' scale and materials.** Rigid is stone, Mumble is a glossy black ghost,
   Blink is a hard-shelled ant with a real moustache, the furry ones are fur. Bluster and Rigid
   are large; Flicker, Giggles and Blink are small.
6. **Check the result** against the references before using it. Wrong eyes, wrong fur colour,
   extra characters: regenerate.
8. **Finish through Topaz, ship AVIF (Chris, 22.09.).** Higgsfield model `topaz_image`, variant
   Standard V2, sharpen 0.3, denoise 0.2, x1 (same output size), prompt "enhance". Then encode
   AVIF (Pillow, quality 68) for Webflow. The look of the first approved hero is the reference:
   `saas-design-investment-statistics` (22.09.2026): bright meeting room, oak table, soft
   daylight, three monsters acting out the post's idea, colour only in the props.

## The characters

| Name | Looks | Character | What he stands for at Cluma |
|---|---|---|---|
| **Gloober** the Glutton | big soft green plush, cream belly patch with a dark green oval, rosy cheeks, sleepy half-closed eyes, dark paw pads; sits or lies down | unhurried, comfortable, everything handled, drifts into naps | everything in one place, no juggling freelancers |
| **Flicker** the Forgetful | small, scruffy dark-grey fur, two huge round pale eyes, tiny teeth, long arms; scratches his head, waves | puzzled, explains from zero, "what was I doing again?" | request anything, any time |
| **Zap** the Hyper | small fox-like, pale grey-white fur, dark grey ears and limbs, big round eyes with dark rings like goggles, thin tail; always mid-move | wiry, static-charged, moves before thinking | revisions handled quickly |
| **Mumble** the Mysterious | tall thin black glossy ghost, two small ears, two glowing white eyes, ragged hem, hovers | silent, featureless, present before anyone notices | everything visible on the board; the data voice |
| **Noodle** (Nervous Noodle) | tall lanky yellow-orange, thin striped limbs, drooping brows, wide anxious eyes, pale belly; wrings hands, covers face, thumbs up | trembling perfectionist, names every edge case | getting it right, attention to detail |
| **Blink** the Curious | small orange ant on stilt legs, two huge glossy black eyes, white moustache, two antennae, black shoes; points, thinks, hands on hips | investigative, follows the thread, into every corner | consistency across everything |
| **Bluster** the Bragger | big teal-blue furry gorilla build, pale muscular chest, small horns, grin with fangs; flexes | broad-chested, booming, thinks highly of himself | one fixed rate, brags about it monthly |
| **Grizzle** the Grump | round ball of magenta-purple fur, mouth with two fangs mostly hidden in the fur, small feet; turns away, arms crossed | permanent scowl, no patience, debunks | unlimited revisions until it is right |
| **Giggles** the Jokester | small black glossy imp, curved horns, huge round eyes, wide grin full of teeth, pointed ears; laughs, tumbles, lies on his back | mischievous, reliable underneath the pranks, never takes a day off | consistent, uninterrupted service |
| **Rigid** the Stubborn | grey stone boulder with stubby arms and legs, two round white eyes, a row of small teeth; stands or curls into a rock | blocky, goes through walls, never changes a decision | the inflexible foil: fixed contracts, scope that cannot change |

## How they relate (use this to build a scene)

- **Rigid is the foil.** He is never the hero of an image. He stands for the way the reader
  should not work. The others are what Cluma is; Rigid is what it is not. A scene with Rigid
  shows the contrast: Zap runs around him, Grizzle is annoyed by him, Gloober sleeps on him.
- **Zap and Gloober are opposites**, speed and calm. Together they make a joke about pace.
- **Bluster and Grizzle** are the loud pair: one boasts, the other grumbles at the boasting.
- **Mumble** stands apart. Quiet, slightly behind or above the others, watching. He owns
  anything about numbers, data, transparency and boards.
- **Noodle** worries about what could go wrong; **Blink** goes and checks. They pair on
  anything about method, verification and sources.
- **Flicker** asks the beginner's question; **Giggles** makes light of the problem. They pair on
  explainers and lighter pieces.
- Matching a post: data and statistics → Mumble (lead), with Blink or Noodle. Myth-busting →
  Grizzle. Speed and turnaround → Zap, with Rigid as contrast. Comfort and onboarding →
  Gloober. Opinion pieces → Bluster. Beginner guides → Flicker.

Voice profiles for writing (parked) live in the cluma-blog skill, `references/voices.md`.
