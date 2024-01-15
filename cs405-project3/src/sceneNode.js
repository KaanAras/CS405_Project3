/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

 class SceneNode {
    constructor(meshDrawer, trs, parent = null) {
        this.meshDrawer = meshDrawer;
        this.trs = trs;
        this.parent = parent;
        this.children = [];

        if (parent) {
            this.parent.__addChild(this);
        }
    }

    __addChild(node) {
        this.children.push(node);
    }

    draw(mvp, modelView, normalMatrix, modelMatrix) {
        // Compute the node's local transformation matrix
        let localTransformationMatrix = this.trs.getTransformationMatrix();
        
        // If there is a parent, apply the parent's model matrix to this node's transformations
        let worldModelMatrix = modelMatrix ? MatrixMult(modelMatrix, localTransformationMatrix) : localTransformationMatrix;
        let worldMvp = MatrixMult(mvp, worldModelMatrix);
        let worldModelView = MatrixMult(modelView, worldModelMatrix);
        
        
        let worldNormalMatrix = normalMatrix; 
        
        // Draw the current node with its world space transformation matrices
        if (this.meshDrawer) {
            this.meshDrawer.draw(worldMvp, worldModelView, worldNormalMatrix, worldModelMatrix);
        }
        
        // Recursively draw children with the updated world matrices
        for (let child of this.children) {
            child.draw(worldMvp, worldModelView, worldNormalMatrix, worldModelMatrix);
        }
    }
}