import type { Project } from "@/types"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "../ui/select"
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/contexts/AppContext"

export const ProjectSelector= ({projects} : {projects: Project[]}) => {

    const {activeProject, setActiveProject} = useAppContext();
    const selectedProject = projects.find(p => p.id === activeProject);

    if(!projects || projects.length <= 1) {
        return null
    }

    return (
        <>
            <Select 
                value={activeProject || ""} 
                onValueChange={(value) => setActiveProject(value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un projet">
                        {selectedProject?.name || "Selectionnez un projet"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Projets</SelectLabel>
                        {projects.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                                {project.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Separator orientation="vertical" className="h-6" />
        </>
    )
}