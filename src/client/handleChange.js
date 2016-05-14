import {diff, patchMetaData} from "./reloadUtils"
import {info, warn} from "./console"
import {isPlainObj, values, find} from "../common"

export function handleChanges(scope$$, {modules: newModules, entryId: newEntryId}) {
  const {modules, require: __require} = scope$$

  const modulesToReload = diff(modules, newModules, newEntryId)
  patchMetaData(scope$$, newModules)

  if (modulesToReload.length === 0) {
    info("Nothing to patch")
    return
  }

  const patch = modulesToReload.map(mod => ({
    id: mod.id,
    changed: mod.changed,
    file: mod.file,
    source: mod.source,
    parents: mod.parents.map(Number),
    isNew: mod.isNew
  }))

  const propagationGuards = {}
  patch.forEach(({id, changed, parents}) => {
    propagationGuards[id] = (propagationGuards[id] || 0) + (changed ? 1 : 0)
    parents.forEach(p => propagationGuards[p] = (propagationGuards[p] || 0) + 1)
  })

  info("Apply patch")
  try {
    patch.forEach(({id, file, parents, isNew}) => {
      if (propagationGuards[id] > 0) {
        patchModule(scope$$, {id, file, parents, isNew})

        if (!isNew && (accepted || isStoppable(reloadedExports || {}))) {
          preventPropagation(parents)
        }
      } else {
        // this will prevent propagation to ancestor files
        preventPropagation(parents)
      }
    })
    info("Patching complete")
  } catch (e) {
    if (!e.aborted) {
      console.error(e)
    }
  }

  function preventPropagation(parents) {
    parents.forEach(p => {
      const parent = find(patch, ({id}) => id === p)
      if (parent) {
        propagationGuards[parent.id]--
      }
    })
  }
}

export function patchModule(scope$$, {id, file, parents, isNew})
{
  var __require = scope$$.require;
    
  if (isNew) {
    console.log(" > Add new module  ::", file)
  } else {
    console.log(" > Patch module    ::", file)
  }

  let reloadedExports, accepted = false
  try {
    // ATTENTION: must use scope object because it has been mutated during "pathMetaData"
    delete scope$$.exports[id]
    scope$$.modules[id].__inited = false
    reloadedExports = __require.__byId(id, true)
  } catch (e) {
    if (e.accepted) {
      console.log(" > Manually accepted")
      accepted = true
    } else {
      console.error(e)
      warn("Abort patching")
      throw {aborted: true}
    }
  }
}


function isStoppable(exports) {
  if (isProxied(exports)) {
    return true
  } else if (isPlainObj(exports)) {
    return !!find(values(exports), isProxied)
  }
  return false
}

function isProxied(o) {
  return o && !!o.__reactPatchProxy
}
