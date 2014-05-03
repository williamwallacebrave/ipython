
//============================================================================
// Cell Execution Waiting Queue
//============================================================================

IPython.namespace('IPython.queue');

IPython.queue = (function (IPython) {
    "use strict";

    var CellExecutionQueue = function () {
        this._queue_map = {};
        this._queue_order = [];
    };

    /**
     * Add CellCode object which could not be executed to the waiting
     * queue.
     *
     * @method add
     */
    Queue.prototype.add = function (cell) {
        var cell_id = cell.cell_id,
            cell_index = this._queue_order.indexOf(cell_id);

        // if the same cell was run again and it still cannot be
        // executed it will be added at the end of the queue and
        // the previous execution attempt would be removed from the
        // queue
        if (cell_index != -1) {
            this._queue_order.splice(cell_index, 1);
        }

        this._queue_order.push(cell_id);
        this._queue_map[cell_id] = cell;
    };

    /**
     * Returns first cell in the queue without removing it from the queue.
     * In order to remove the cell one needs to call remove method
     * @method get
     */
    Queue.prototype.get = function () {
        var cell_id = this._queue_order.shift();

        return this._queue_map[cell_id];
    };


    /**
     * If after getting cell from the queue it's execution was successful
     * one can remove it by calling remove method.
     * @method remove
     */
    Queue.prototype.remove = function (cell) {
        return (delete this._queue_map[cell.cell_id]);
    };

    /**
     * Returns true is queue is empty otherwise false.
     * @method is_empty
     */
    Queue.prototype.is_empty = function () {
        return (this._queue_order.length === 0);
    };


    IPython.queue = new CellExecutionQueue();


    return IPython;

}(IPython));
