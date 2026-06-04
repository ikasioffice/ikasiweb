// Auto-scrolling photo gallery (two opposite marquee rows).
// Replace the placeholder images in `row1`/`row2` with real IKASI photos
// (e.g. files under /public/gallery/*.jpg) when available.

type Photo = { src: string; caption: string };

const row1: Photo[] = [
  { src: "https://picsum.photos/seed/ikasi-reuni1/600/400", caption: "Reuni Akbar 2023" },
  { src: "https://picsum.photos/seed/ikasi-seminar2/600/400", caption: "Seminar BIM" },
  { src: "https://picsum.photos/seed/ikasi-gathering3/600/400", caption: "Gathering Jabar" },
  { src: "https://picsum.photos/seed/ikasi-proyek4/600/400", caption: "Kunjungan Proyek" },
  { src: "https://picsum.photos/seed/ikasi-wisuda5/600/400", caption: "Wisuda Alumni" },
  { src: "https://picsum.photos/seed/ikasi-futsal6/600/400", caption: "Fun Futsal" },
];

const row2: Photo[] = [
  { src: "https://picsum.photos/seed/ikasi-bakti7/600/400", caption: "Bakti Sosial" },
  { src: "https://picsum.photos/seed/ikasi-rapat8/600/400", caption: "Munas IKASI" },
  { src: "https://picsum.photos/seed/ikasi-halal9/600/400", caption: "Halal Bihalal" },
  { src: "https://picsum.photos/seed/ikasi-pelatihan10/600/400", caption: "Pelatihan SKA" },
  { src: "https://picsum.photos/seed/ikasi-donor11/600/400", caption: "Donor Darah" },
  { src: "https://picsum.photos/seed/ikasi-ultah12/600/400", caption: "Anniversary IKASI" },
];

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
