// Auto-scrolling photo gallery (two opposite marquee rows).
// Photos live under /public/gallery/*.jpg.

type Photo = { src: string; caption: string };

const photos: Photo[] = [
  { src: "/gallery/liga-expose-2022-juara.jpg", caption: "Liga Expose IKA Polban 2022 (CVL Soccer)" },
  { src: "/gallery/liga-expose-2022-runnerup.jpg", caption: "Runner Up Liga Expose 2022" },
  { src: "/gallery/kji-kbgi-2013.jpg", caption: "KJI–KBGI Polban 2013" },
  { src: "/gallery/kji-kbgi-2012.jpg", caption: "KJI–KBGI 2012" },
  { src: "/gallery/kji-kbgi-2012-1.jpg", caption: "KJI–KBGI 2012" },
];

// Top row in original order; bottom row reversed so the two marquees differ.
const row1: Photo[] = photos;
const row2: Photo[] = [...photos].reverse();

function Figure({ photo }: { photo: Photo }) {
  return (
    <figure className="relative h-40 w-60 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm sm:h-48 sm:w-72">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} alt={photo.caption} className="h-full w-full object-cover" loading="lazy" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-white">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

export function PhotoGallery() {
  const r1 = [...row1, ...row1];
  const r2 = [...row2, ...row2];
  return (
    <div className="space-y-4">
      <div className="marquee">
        <div className="marquee-track marquee-ltr">
          {r1.map((p, i) => (
            <Figure key={`r1-${i}`} photo={p} />
          ))}
        </div>
      </div>
      <div className="marquee">
        <div className="marquee-track marquee-rtl">
          {r2.map((p, i) => (
            <Figure key={`r2-${i}`} photo={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
