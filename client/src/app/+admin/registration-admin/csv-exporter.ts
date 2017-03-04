import {CacheService} from "../../remote/cache.service";
import {ISubgroup} from "../../../../../server/entities/subgroup.interface";
import {IGroup} from "../../../../../server/entities/group.interface";
import {IPerson} from "../../../../../server/entities/person.interface";
import {IExportPerson} from "../../../../../server/entities/export-person.interface";
import {List} from "immutable";
var json2csv = require('json2csv');

export class CsvExporter {

  constructor(private groupCache: CacheService<IGroup>, private subgroupCache: CacheService<ISubgroup>) {
  }

  private extend(persons: IPerson[]): IExportPerson[] {
    let result: IExportPerson[] = [];
    List<IPerson>(persons).forEach(person => {
      let subgroup = this.subgroupCache.getCache(person.subgroupId);
      result.push({
        createDate: person.createDate,
        firstname: person.firstname,
        lastname: person.lastname,
        street: person.street,
        streetNumber: person.streetNumber,
        plz: person.plz,
        city: person.city,
        email: person.email,
        phoneNumber: person.phoneNumber,
        dateOfBirth: person.dateOfBirth,
        allergies: person.allergies,
        comments: person.comments,
        notification: person.notification,
        groupName: this.groupCache.getCache(subgroup.groupId).name,
        subgroupName: subgroup.name,
        leader: (person.leader?'ja':'nein'),
      });
    });
    return result;
  }

  private static getFields() {
    return ['createDate', 'firstname', 'lastname', 'street', 'streetNumber', 'plz', 'city', 'email', 'phoneNumber', 'dateOfBirth', 'allergies', 'comments', 'notification', 'groupName', 'subgroupName', 'leader'];
  }

  private static getFieldNames() {
    return ['Anmeldedatum', 'Vorname', 'Nachname', 'Strasse', 'Hausnummer', 'PLZ', 'Ort', 'E-Mail', 'Telefonnummer', 'Geburtsdatum', 'Allergien/Diät', 'Bemerkungen', 'Benachrichtigung', 'Ortsgruppe', 'Gruppe', 'Leiter'];
  }

  public export(persons: IPerson[]): any {
    return json2csv({data: this.extend(persons), fields: CsvExporter.getFields(), fieldNames: CsvExporter.getFieldNames()});
  }
}
