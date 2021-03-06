# Grid component

Grid is a low level React component that provides ability to show and position tabular data.
It doesn't implement full Excel-like spreadsheet features but provides some API.

Core feature of this component is to virtualize tabular data, show it and its related headers.
Component contains some keyboard shortcuts for navigating, editing and copy-pasting.
However, component do not copy-paste data itself, but provides api for that.

Component does not contain any theme but implements positioning inline styles.
You can provide your custom CSS class names and inline styles for every component of the Grid.

Component by default has `width: 100%, height: 100%` style, so you can put Grid inside fixed size component
or provide class name or CSS style. Grid autosizes itself.

## Prop types
| Property name | Type | Required? | Description |
|:---|:---|:---:|:---|
|tabIndex|number||Root component tab index attribute. Default = -1.|
|preserveScrollbars|boolean||Always show scrollbars. Otherwise it will be automatically hidden. Defailt is `false`.|
|repository|[HeaderRepository](/api/headers)|✓|Read [this](/api/headers) article for details.|
|data|any||Data source. Not used directly, only passed to all other grid properties. Can be any type.|
|readOnly|boolean||Set Grid to readonly mode.|
|overscanRows<br>overscanColumns|number||Grid renders only exact amount of row and columns that fits into viewport by default. These settings can expand this range.|
|theme|[IGridTheme](#IGridTheme)||Grid theme. Used to define class names and styles for grid parts, also provided to header and cell renderers.|
|selection|[IGridSelection\[\]](#IGridSelection)||Controlled selection.|
|active|[IGridAddress](#IGridAddress)||Controlled active cell.|

## Prop handlers
All prop handlers implement this interface:
```typescript
onName(e: EventType) => (JSX.Element | void)
```
#### Renderers
Every callback must return `JSX.Element` type.

| Property name | Event type | Required? | Description |
|:---|:---|:---:|:---|
|onRenderCell|[ICellRendererEvent](#ICellRendererEvent)|✓|Cell renderer.|
|onRenderHeader|[IHeaderRendererEvent](#IHeaderRendererEvent)|✓|Header renderer.|
|onRenderHeaderCorner|||Header corner (top left) renderer.|
|onRenderSelection|[ISelectionRendererEvent](#ISelectionRendererEvent)||User's selection renderer. [Example](/examples/resizing). Of not provided - cell selection, mouse and keyboard interaction will be disabled.|
|onRenderEditor|[ICellEditorEvent](#ICellEditorEvent)||Editor renderer. See [this](/api/editor) article for details.|
|onRenderResizer|[IResizerRenderEvent](#IResizerRenderEvent)||Resizer renderer. [Example](/examples/resizing).|

#### Other
All other optional callbacks.

| Property name | Event type | Description |
|:---|:---|:---|:---|
|onAutoMeasure|[ICellsMeasureEvent](#ICellsMeasureEvent)|Auto measure callback. Read [this](/examples/autosizing) article for details.|
|onSpace|[IGridSpaceEvent](#IGridSpaceEvent)|Called when space bar is pressed. Useful to manage cells which rendered as checkboxes. Header read only check is not applied here.|
|onRemove|[IGridRemoveEvent](#IGridRemoveEvent)|Called when `CMD`+`DELETE` is pressed. Remove records here. Header read only check is not applied here.|
|onNullify|[IGridNullifyEvent](#IGridNullifyEvent)|Called when `DELETE` key is pressed. Remove values here.|
|onCopy|[IGridCopyEvent](#IGridCopyEvent)|Callback used for copying cells. Read [copy-paste](/examples/copy-and-paste) article for details. |
|onPaste|[IGridPasteEvent](#IGridPasteEvent)|Callback used for pasting cells. Read [copy-paste](/examples/copy-and-paste) article for details. |
|onRightClick|[IGridCellRightClickEvent](#IGridCellRightClickEvent)|Called when right click pressed on cell.|
|onHeaderRightClick|[IGridHeaderRightClickEvent](#IGridHeaderRightClickEvent)|Called when right click pressed on header.|
|onUpdate|[IGridUpdateEvent](#IGridUpdateEvent)|Called when editor changed cell's value. Update data source here.|
|onSelection|[IGridSelectionEvent](#IGridSelectionEvent)|Called when active cell (cursor) or selection is changed.|
|onHeaderResize|[IGridResizeCombinedEvent](#IGridResizeCombinedEvent)|Called when headers were resized (by autosize event or manually).|
|onReadOnly|[IGridReadOnlyEvent](#IGridReadOnlyEvent)|Checks if current cell is readonly. If returns true, editing of that cell will be forbidden. Header's `$readOnly` property will not be used.|

## Class methods
| Method | Description |
|:---|:---|:---|
|`scrollTo(cell: { column?: number, row?: number })`|Scroll to specific column, row or cell.|
|`openEditor(cell: { column? number, row: number })`|Opens editor in this cell.|
|`closeEditor(commit: boolean, callback?: () => void)`|Close opened editor.<br>- `commit` parameter defines if updated value must be committed to data source.<br>- optional `callback` called after editor is closed and grid rendered with new state.|
|`updateSelection(event: { active?: IGridAddress, selection?: IGridSelection[] }, callback?: () => void)`|Update selection or/and active cell. Callback called after internal state was updated.|

## Types

#### <a name="IGridAddress"></a>
```typescript
interface IGridAddress {
    row: number;
    column: number;
}
```

#### <a name="IGridSelection"></a>
```typescript
interface IGridSelection {
    row: number;
    column: number;
    width: number;
    height: number;
}
```

#### <a name="IGridTheme"></a>
```typescript
interface IGridTheme {
    classNameGrid?: string;
    classNameGridCorner?: string;
    classNameGridRows?: string;
    classNameGridColumns?: string;
    classNameScrollView?: string;

    styleGrid?: React.CSSProperties;
    styleGridCorner?: React.CSSProperties;
    styleGridRows?: React.CSSProperties;
    styleGridColumns?: React.CSSProperties;

    [key: string]: any;
}
```

#### <a name="ICellRendererEvent"></a>
```typescript
interface ICellRendererEvent {
    // view row index
    row: number;
    // view column index
    column: number;
    // row header object
    rowHeader: IHeader;
    // column header object
    columnHeader: IHeader;
    // data source
    data: any;
    // active cell flag
    active: boolean;
    // positioning style, must be applied to rendering element
    style: React.CSSProperties;
    // grid theme object
    theme: IGridTheme;
}
```

#### <a name="IHeaderRendererEvent"></a>
```typescript
interface IHeaderRendererEvent {
    // header type (HeaderType.Row or HeaderType.Column)
    type: HeaderType;
    // cell in selection flag
    selection: boolean;
    // positioning style, must be applied to rendering element
    style: React.CSSProperties;
    // current header object
    header: IHeader;
    // this header is parent header flag
    parent: boolean;
    // view index (row or column, -1 if parent)
    viewIndex: number;
    // parent header object
    parentHeader: IHeader;
    // grid theme object
    theme: IGridTheme;
}
```

#### <a name="ISelectionRendererEvent"></a>
```typescript
interface ISelectionRendererEvent {
    // JSX key attribute, must be applied to rendering element
    key: number;
    // positioning style, must be applied to rendering element
    style: React.CSSProperties;
    // active cell selection flag, usually this is selection with border and no background
    active: boolean;
    // grid in edit mode flag, don't apply selection background if `true`
    edit: boolean;
    // grid theme object
    theme: IGridTheme;
}
```

#### <a name="ICellEditorEvent"></a>
```typescript
interface ICellEditorEvent {
    row: number;
    column: number;
    rowHeader: IHeader;
    columnHeader: IHeader;
    data: any;
    active: boolean;
    style: React.CSSProperties;
    theme: IGridTheme;
    // called by rendered editor when grid should close editor
    close: (commit: boolean) => void;
    // called by rendered editor when grid should update value
    update: (nextValue: any) => void;
}
```

#### <a name="IResizerRenderEvent"></a>
```typescript
interface IResizerRenderEvent {
    type: 'level' | 'header';
    orientation: 'horizontal' | 'vertical';
    resizer: 'initial' | 'changed';
    style: React.CSSProperties;
    theme: IGridTheme;
}
```

#### <a name="ICellsMeasureEvent"></a>
```typescript
interface ICellRenderBaseEvent {
    row: number;
    column: number;
    rowHeader: IHeader;
    columnHeader: IHeader;
}

interface IHeaderMeasure {
    index: number;
    type: HeaderType;
    level: number;
    header: IHeader;
}

interface ICellMeasureResult {
    row: number;
    column: number;
    width: number;
    height: number;
}

interface IHeaderMeasureResult {
    header: IHeader;
    width: number;
    height: number;
}

interface IMeasureResult {
    cells?: ICellMeasureResult[];
    headers?: IHeaderMeasureResult[];
}

interface ICellsMeasureEvent {
    cells: ICellRenderBaseEvent[];
    headers: IHeaderMeasure[];
    data: any;
    callback: (result: IMeasureResult) => void;
}
```

#### <a name="IGridSpaceEvent"></a>
```typescript
interface IGridSpaceEvent {
    cells: IGridAddress[];
}
```

#### <a name="IGridRemoveEvent"></a>
```typescript
interface IGridRemoveEvent {
    rows: number[];
    columns: number[];
}
```

#### <a name="IGridNullifyEvent"></a>
```typescript
interface IGridNullifyEvent {
    cells: IGridAddress[];
}
```

#### <a name="IGridCopyEvent"></a>
```typescript
interface IGridCopyEvent {
    cells: IGridAddress[];
    data: any;
    repository: HeaderRepository;
    // This flag shows, that cells must be copied with headers
    withHeaders: boolean;
    // Focus grid callback
    focus: () => void;
}
```

#### <a name="IGridPasteEvent"></a>
```typescript
interface IGridPasteEvent {
    repository: HeaderRepository;
    data: any;
    target: IGridAddress;
}
```

#### <a name="IGridCellRightClickEvent"></a>
```typescript
interface IGridCellRightClickEvent {
    cell: IGridAddress;
    event: React.MouseEvent<HTMLElement>;
    /** Select current cell. */
    select: () => void;
    /** Right click was inside any selection. */
    inside: boolean;
}
```

#### <a name="IGridHeaderRightClickEvent"></a>
```typescript
interface IGridHeaderRightClickEvent {
    header: IHeader;
    event: React.MouseEvent<HTMLElement>;
}
```

#### <a name="IGridUpdateEvent"></a>
```typescript
interface IGridUpdateEvent {
    cell: IGridAddress;
    value: any;
}
```

#### <a name="IGridSelectionEvent"></a>
```typescript
interface IGridSelectionEvent {
    active?: {
        previous: IGridAddress;
        current: IGridAddress;
    };
    selection?: {
        previous: IGridSelection[];
        current: IGridSelection[];
    };
}
```

#### <a name="TGridReadOnlyEventSource"></a>
```typescript
type TGridReadOnlyEventSource = 'editor' | 'paste' | 'nullify' | 'remove';
```

#### <a name="IGridReadOnlyEvent"></a>
```typescript
interface IGridReadOnlyEvent {
    column: IHeader;
    row: IHeader;
    source: TGridReadOnlyEventSource;
}
```

#### <a name="IGridResizeCombinedEvent"></a>
```typescript
interface IGridResizeHeaderLevel {
    type: HeaderType;
    level: number;
    size: number;
}

interface IGridResizeHeader {
    type: HeaderType;
    header: IHeader;
    size: number;
}

interface IGridResizeCombinedEvent {
    levels?: IGridResizeHeaderLevel[];
    headers?: IGridResizeHeader[];
    behavior: 'auto' | 'manual' | 'reset';
}
```