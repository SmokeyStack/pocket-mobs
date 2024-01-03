import {
    Entity,
    EntityInventoryComponent,
    EquipmentSlot,
    ItemStack,
    world,
    system
} from '@minecraft/server';

import { PlayerLog } from './player_log';

let delay = new PlayerLog<number>();

world.afterEvents.playerInteractWithEntity.subscribe((eventData) => {
    if (
        eventData.itemStack == null ||
        eventData.itemStack.getDynamicPropertyIds().length != 0 ||
        eventData.itemStack.typeId != 'smokeystack_pocket_mobs:pocket_empty'
    )
        return;

    let item: ItemStack = new ItemStack(
        'smokeystack_pocket_mobs:pocket_filled'
    );
    let target: Entity = eventData.target;
    item.setDynamicProperty('id', target.typeId);

    if (target.hasComponent('minecraft:health'))
        item.setDynamicProperty(
            'health',
            target.getComponent('minecraft:health').currentValue
        );

    if (target.hasComponent('minecraft:breathable'))
        item.setDynamicProperty(
            'breathable',
            target.getComponent('minecraft:breathable').totalSupply
        );

    if (target.hasComponent('minecraft:color'))
        item.setDynamicProperty(
            'color',
            target.getComponent('minecraft:color').value
        );

    /*
    https://discord.com/channels/523663022053392405/1163874958003417119/1163949868042170389
    Temporary disabled for every entities but players
    if (target.hasComponent('minecraft:equippable')) {
        item.setDynamicProperty(
            'equippable_helmet',
            target
                .getComponent('minecraft:equippable')
                .getEquipment(EquipmentSlot.Head).typeId
        );
        item.setDynamicProperty(
            'equippable_chest',
            target
                .getComponent('minecraft:equippable')
                .getEquipment(EquipmentSlot.Chest).typeId
        );
        item.setDynamicProperty(
            'equippable_legs',
            target
                .getComponent('minecraft:equippable')
                .getEquipment(EquipmentSlot.Legs).typeId
        );
        item.setDynamicProperty(
            'equippable_feet',
            target
                .getComponent('minecraft:equippable')
                .getEquipment(EquipmentSlot.Feet).typeId
        );
        item.setDynamicProperty(
            'equippable_main_hand',
            target
                .getComponent('minecraft:equippable')
                .getEquipment(EquipmentSlot.Mainhand).typeId
        );
        item.setDynamicProperty(
            'equippable_off_hand',
            target
                .getComponent('minecraft:equippable')
                .getEquipment(EquipmentSlot.Offhand).typeId
        );
    }
    */

    if (target.hasComponent('minecraft:flying_speed'))
        item.setDynamicProperty(
            'flying_speed',
            target.getComponent('minecraft:flying_speed').value
        );

    if (target.hasComponent('minecraft:friction_modifier'))
        item.setDynamicProperty(
            'friction_modifier',
            target.getComponent('minecraft:friction_modifier').value
        );

    if (target.hasComponent('minecraft:is_baby'))
        item.setDynamicProperty('is_baby', true);

    if (target.hasComponent('minecraft:is_charged'))
        item.setDynamicProperty('is_charged', true);

    if (target.hasComponent('minecraft:is_illager_captain'))
        item.setDynamicProperty('is_illager_captain', true);

    if (target.hasComponent('minecraft:is_sheared'))
        item.setDynamicProperty('is_sheared', true);

    if (target.hasComponent('minecraft:is_stunned'))
        item.setDynamicProperty('is_stunned', true);

    if (target.hasComponent('minecraft:lava_movement'))
        item.setDynamicProperty(
            'lava_movement',
            target.getComponent('minecraft:health').currentValue
        );

    if (target.hasComponent('minecraft:mark_variant'))
        item.setDynamicProperty(
            'mark_variant',
            target.getComponent('minecraft:mark_variant').value
        );

    if (target.hasComponent('minecraft:push_through'))
        item.setDynamicProperty(
            'push_through',
            target.getComponent('minecraft:push_through').value
        );

    if (target.hasComponent('minecraft:scale'))
        item.setDynamicProperty(
            'scale',
            target.getComponent('minecraft:scale').value
        );

    if (target.hasComponent('minecraft:skin_id'))
        item.setDynamicProperty(
            'skin_id',
            target.getComponent('minecraft:skin_id').value
        );

    if (target.hasComponent('minecraft:underwater_movement'))
        item.setDynamicProperty(
            'underwater_movement',
            target.getComponent('minecraft:underwater_movement').currentValue
        );

    item.setLore([
        target.typeId,
        `Health: ${target.getComponent('minecraft:health').currentValue}`
    ]);

    if (target.hasComponent('minecraft:color')) {
        let lore = item.getLore();
        lore.push(`Color: ${target.getComponent('minecraft:color').value}`);
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:is_baby')) {
        let lore = item.getLore();
        lore.push('Baby');
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:is_charged')) {
        let lore = item.getLore();
        lore.push('Charged');
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:is_illager_captain')) {
        let lore = item.getLore();
        lore.push('Captain');
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:is_sheared')) {
        let lore = item.getLore();
        lore.push('Sheared');
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:is_stunned')) {
        let lore = item.getLore();
        lore.push('Stunned');
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:mark_variant')) {
        let lore = item.getLore();
        lore.push(
            `Mark Variant: ${
                target.getComponent('minecraft:mark_variant').value
            }`
        );
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:scale')) {
        let lore = item.getLore();
        lore.push(`Scale: ${target.getComponent('minecraft:scale').value}`);
        item.setLore(lore);
    }

    if (target.hasComponent('minecraft:skin_id')) {
        let lore = item.getLore();
        lore.push(`Skin ID: ${target.getComponent('minecraft:skin_id').value}`);
        item.setLore(lore);
    }

    let inv: EntityInventoryComponent = eventData.player.getComponent(
        'minecraft:inventory'
    ) as any;
    inv.container?.getSlot(eventData.player.selectedSlot).setItem(item);
    target.remove();
});

world.afterEvents.playerInteractWithBlock.subscribe((eventData) => {
    if (
        eventData.itemStack == null ||
        eventData.itemStack.getDynamicPropertyIds() == null ||
        eventData.itemStack.typeId != 'smokeystack_pocket_mobs:pocket_filled'
    )
        return;

    if (Date.now() - delay.get(eventData.player) < 1000) return;

    delay.set(eventData.player, Date.now());
    let item: ItemStack = eventData.itemStack;
    let inv: EntityInventoryComponent = eventData.player.getComponent(
        'minecraft:inventory'
    ) as any;
    inv.container
        ?.getSlot(eventData.player.selectedSlot)
        .setItem(new ItemStack('smokeystack_pocket_mobs:pocket_empty'));
    let entity: Entity = eventData.player.dimension.spawnEntity(
        item.getDynamicProperty('id').toString(),
        eventData.faceLocation
    );

    if (item.getDynamicProperty('is_baby') != null)
        entity.runCommand('event entity @s minecraft:entity_born');

    if (item.getDynamicProperty('is_charged') != null)
        entity.runCommand('event entity @s minecraft:become_charged');

    if (item.getDynamicProperty('is_illager_captain') != null)
        entity.runCommand('event entity @s minecraft:spawn_as_illager_captain');

    if (item.getDynamicProperty('is_sheared') != null)
        entity.runCommand('event entity @s minecraft:sheep_sheared');

    if (item.getDynamicProperty('is_stunned') != null)
        entity.runCommand('event entity @s minecraft:become_stunned');

    if (item.getDynamicProperty('health') != null)
        entity
            .getComponent('minecraft:health')
            .setCurrentValue(item.getDynamicProperty('health') as number);

    if (item.getDynamicProperty('breathable') != null)
        entity
            .getComponent('minecraft:breathable')
            .setAirSupply(item.getDynamicProperty('breathable') as number);

    if (item.getDynamicProperty('color') != null)
        entity.getComponent('minecraft:color').value = item.getDynamicProperty(
            'color'
        ) as number;

    if (item.getDynamicProperty('flying_speed') != null)
        entity.getComponent('minecraft:flying_speed').value =
            item.getDynamicProperty('flying_speed') as number;

    if (item.getDynamicProperty('friction_modifier') != null)
        entity.getComponent('minecraft:friction_modifier').value =
            item.getDynamicProperty('friction_modifier') as number;

    if (item.getDynamicProperty('lava_movement') != null)
        entity
            .getComponent('minecraft:lava_movement')
            .setCurrentValue(
                item.getDynamicProperty('lava_movement') as number
            );

    if (item.getDynamicProperty('mark_variant') != null)
        entity.getComponent('minecraft:mark_variant').value =
            item.getDynamicProperty('mark_variant') as number;

    if (item.getDynamicProperty('push_through') != null)
        entity.getComponent('minecraft:push_through').value =
            item.getDynamicProperty('push_through') as number;

    if (item.getDynamicProperty('scale') != null)
        entity.getComponent('minecraft:scale').value = item.getDynamicProperty(
            'scale'
        ) as number;

    if (item.getDynamicProperty('skin_id') != null)
        entity.getComponent('minecraft:skin_id').value =
            item.getDynamicProperty('skin_id') as number;

    if (item.getDynamicProperty('underwater_movement') != null)
        entity
            .getComponent('minecraft:underwater_movement')
            .setCurrentValue(
                item.getDynamicProperty('underwater_movement') as number
            );
});

system.runInterval(() => {
    world.getAllPlayers().forEach((player) => {
        let inv: EntityInventoryComponent = player.getComponent(
            'minecraft:inventory'
        ) as any;

        if (inv.container.getSlot(player.selectedSlot).getItem() == null)
            return;

        let lore: string = '';
        inv.container
            .getSlot(player.selectedSlot)
            .getItem()
            .getLore()
            .forEach((element) => {
                lore = lore + element + '\n';
            });

        player.runCommand(`title @s actionbar ${lore}`);
    });
}, 20);
