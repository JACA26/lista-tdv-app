import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import {DataService} from './data.service';

@Component({
  selector: 'scheduler-component',
  template: `<daypilot-scheduler [config]="config" [events]="events" #scheduler></daypilot-scheduler>`,
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements AfterViewInit {

  formModal  = [
    { name: "Name", id: "text", type: "text"},
    { name: "Colores", id: "color", type: "select", options: [
      { name: 'Rojo', id: 'red' },
      {
        id: "#00B050",
        name: "Normal",
      },
      {
          id: "#FFC000",
          name: "Frágil",
      },
      {
          id: "#FF0000",
          name: "Peligroso",
      },
      {
          id: "#7030A0",
          name: "Perecedera",
      },
      {
          id: "#5B9BD5",
          name: "Granel",
      }
    ]},
  ];

  @ViewChild('scheduler')
  scheduler!: DayPilotSchedulerComponent;

  events: DayPilot.EventData[] = [];

  config: DayPilot.SchedulerConfig = {
    
    timeHeaders: [
      {groupBy: "Day"},
      {groupBy: "Hour", format: "hh tt"}
    ],
    
    scale: "Hour",
    days: 1,
    startDate: DayPilot.Date.today(),
    
    rowHeaderColumns: [
      {text: "Proveedor", display: "proveedor", sort: "proveedor"},
    ],
    
    timeRangeSelectedHandling: "Enabled",
    
    onTimeRangeSelected: async (args) => {
      const dp = args.control;
      const modal = await DayPilot.Modal.form(this.formModal, args);
      dp.clearSelection();
      if (modal.canceled) { return; }
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        resource: args.resource,
        text: modal.result.text,
        barColor: modal.result.color,
      });
    },
    
    contextMenu: new DayPilot.Menu({
      items: [
        { text: "Edit...",
          onClick: async args => {
            const e = args.source;
            this.editEvent(e);
          }
        },
        { text: "Delete",
          onClick: args => {
            const e = args.source;
            this.scheduler.control.events.remove(e);
          }
        }
      ]
    }),
    onBeforeEventRender: args => {
      args.data.areas = [
        {
          right: 5,
          top: 10,
          width: 16,
          height: 16,
          symbol: "assets/daypilot.svg#minichevron-down-2",
          fontColor: "#aaa",
          backColor: "#fff",
          action: "ContextMenu",
          style: "border: 1px solid #aaa",
          visibility: "Hover"
        }
      ];
    },
    bubble: new DayPilot.Bubble({
      onLoad: args => {
        args.html = DayPilot.Util.escapeHtml(args.source.data.description || "");
      }
    }),
    onEventClick: args => {
      this.editEvent(args.e);
    },
    eventMoveHandling: "Update",
    onEventMoved: (args) => {
      args.control.message("Event moved: " + args.e.text());
    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      args.control.message("Event resized: " + args.e.text());
    },
    treeEnabled: true,
  };

  constructor(private ds: DataService) {
  }

  async editEvent(e: DayPilot.Event): Promise<void> {
    const form = [
      { name: "Name", id: "text", type: "text"},
      { name: "Colores", id: "color", type: "select", options: [
        { name: 'Rojo', id: 'red' },
        {
          id: "#00B050",
          name: "Normal",
        },
        {
            id: "#FFC000",
            name: "Frágil",
        },
        {
            id: "#FF0000",
            name: "Peligroso",
        },
        {
            id: "#7030A0",
            name: "Perecedera",
        },
        {
            id: "#5B9BD5",
            name: "Granel",
        }
      ]},
    ];
    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }
    const updated = modal.result;
    this.scheduler.control.events.update(updated);
  }

  ngAfterViewInit(): void {
    this.ds.getResources().subscribe(result => this.config.resources = result);

    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }

}

