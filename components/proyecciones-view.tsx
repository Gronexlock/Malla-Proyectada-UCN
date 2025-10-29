import { Proyeccion } from "@/src/types/proyeccion";

type ProyeccionViewProps = {
  proyeccion: Proyeccion;
};

const proyecciones: Proyeccion[] = [
  { id: 1, cursos: [] },
  { id: 2, cursos: [] },
  { id: 3, cursos: [] },
];

// export function ProyeccionView({ proyeccion }: ProyeccionViewProps) {
//   return (
//     <ScrollArea className="whitespace-nowrap">
//       <div className="flex justify-center">
//         <div className="inline-flex min-w-max gap-4 p-6 border rounded-lg shadow-sm bg-zinc-100">
//           {proyeccion.proyecciones.map((semestre) => (
//             <div key={semestre.semestre} className="flex flex-col gap-2">
//               <div className="bg-zinc-800 rounded-sm flex justify-center items-center mb-2">
//                 <h2 className="text-center text-white font-semibold">
//                   {semestre.semestre}
//                 </h2>
//               </div>
//               <div className="flex flex-col gap-2">
//                 {semestre.cursos.map((curso) => (
//                   <CursoMallaCard
//                     key={curso.codigo}
//                     codigo={curso.codigo}
//                     asignatura={curso.asignatura}
//                     creditos={curso.creditos}
//                     prereq={[]}
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   );
// }
