"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FolderTree,
  Search,
  X,
  MapPin,
  Waves,
  Mountain,
  Trees,
  Sprout,
  Landmark,
  Shirt,
  Home,
  CalendarDays,
  Plus,
  Check,
  Compass,
  Route,
  Eye,
  PanelLeftClose,
  Sparkles,
  Layers,
  Leaf,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { CULTURAL_EVENTS, CulturalEvent } from "@/data/culturalEvents";

interface SideMenuTreeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: CulturalDestination) => void;
  activeDestination: CulturalDestination | null;
  tripItems: CulturalDestination[];
  onToggleTripItem: (dest: CulturalDestination) => void;
  onFlyToCoords?: (coords: [number, number]) => void;
  language?: "ID" | "EN";
}

interface TreeNode {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  children?: TreeNode[];
  destination?: CulturalDestination;
  event?: CulturalEvent;
}

export function SideMenuTree({
  isOpen,
  onClose,
  onSelectDestination,
  activeDestination,
  tripItems,
  onToggleTripItem,
  onFlyToCoords,
  language = "ID",
}: SideMenuTreeProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<string>("all");

  // Track expanded node IDs
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Default open root nodes
    return new Set<string>([
      "root-wilayah",
      "wilayah-sulawesi",
      "wilayah-lampung",
      "root-kategori",
      "root-trip",
    ]);
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = (allIds: string[]) => {
    setExpandedNodes(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Group destinations by province and sub-theme
  const treeData = useMemo<TreeNode[]>(() => {
    // Dynamic province grouping across entire Indonesia
    const allProvinces = Array.from(new Set(DESTINATIONS.map((d) => d.province))).sort();
    const provinceNodes: TreeNode[] = allProvinces.map((prov) => {
      const pDests = DESTINATIONS.filter((d) => d.province === prov);
      return {
        id: `wilayah-${prov.toLowerCase().replace(/\s+/g, "-")}`,
        label: prov,
        icon: Compass,
        badge: pDests.length,
        children: pDests.map((d) => ({
          id: `dest-${d.id}`,
          label: d.name,
          destination: d,
        })),
      };
    });

    // Categories group
    const categoriesList: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { id: "sumber-alam", label: "Sumber Alam & Geologi", icon: Mountain },
      { id: "pertanian", label: "Hasil Pertanian & Perkebunan", icon: Sprout },
      { id: "herbal", label: "Herbal & Tanaman Obat", icon: Leaf },
      { id: "laut", label: "Wisata Laut & Bahari", icon: Waves },
      { id: "flora-fauna", label: "Flora & Fauna Suaka Rimba", icon: Trees },
      { id: "budaya", label: "Budaya Tradisi & Sejarah", icon: Landmark },
      { id: "pakaian", label: "Wastra & Pakaian Adat", icon: Shirt },
      { id: "desa", label: "Desa Adat Nusantara", icon: Home },
    ];

    const categoryNodes: TreeNode[] = categoriesList.map((cat) => {
      const items = DESTINATIONS.filter((d) => {
        if (cat.id === "laut") {
          return d.category === "laut" || d.category === "pantai" || d.tags?.some((t) => /laut|ikan|bahari/i.test(t));
        }
        if (cat.id === "sumber-alam") {
          return d.category === "sumber-alam" || d.tags?.some((t) => /sumber alam|geologi|mineral|tambang/i.test(t));
        }
        if (cat.id === "herbal") {
          return d.category === "herbal" || d.tags?.some((t) => /herbal|jamu|obat|usada|buah merah/i.test(t));
        }
        if (cat.id === "pertanian") {
          return d.category === "pertanian" || (d.agriculturalProducts && d.agriculturalProducts.length > 0) || d.tags?.some((t) => /tani|kebun|kopi|subak|rempah/i.test(t));
        }
        if (cat.id === "flora-fauna") {
          return d.category === "flora-fauna" || d.category === "hutan" || d.tags?.some((t) => /flora|fauna|satwa|orangutan|gajah|komodo|banteng/i.test(t));
        }
        return d.category === cat.id;
      });
      return {
        id: `cat-${cat.id}`,
        label: cat.label,
        icon: cat.icon,
        badge: items.length,
        children: items.map((dest) => ({
          id: `cat-dest-${dest.id}`,
          label: dest.name,
          destination: dest,
        })),
      };
    });

    // Event nodes
    const eventNodes: TreeNode[] = CULTURAL_EVENTS.map((evt) => ({
      id: `evt-${evt.id}`,
      label: evt.name,
      event: evt,
    }));

    return [
      {
        id: "root-wilayah",
        label: "Wilayah Nusantara (12 Provinsi)",
        icon: MapPin,
        badge: `${DESTINATIONS.length} Destinasi`,
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        children: provinceNodes,
      },
      {
        id: "root-kategori",
        label: "Katalog Kategori Tematik",
        icon: Layers,
        badge: `${categoryNodes.length} Kategori`,
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        children: [
          ...categoryNodes,
          {
            id: "cat-event",
            label: "Event & Radar Budaya Nusantara",
            icon: CalendarDays,
            badge: eventNodes.length,
            children: eventNodes,
          },
        ],
      },
      {
        id: "root-trip",
        label: "Rute Petualangan Saya (Trip Plan)",
        icon: Route,
        badge: `${tripItems.length} Rute`,
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        children: tripItems.map((d) => ({
          id: `trip-item-${d.id}`,
          label: d.name,
          destination: d,
        })),
      },
    ];
  }, [tripItems]);

  // Extract all node IDs for Expand All feature
  const allNodeIds = useMemo(() => {
    const ids: string[] = [];
    const traverse = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.children && n.children.length > 0) {
          ids.push(n.id);
          traverse(n.children);
        }
      }
    };
    traverse(treeData);
    return ids;
  }, [treeData]);

  // Filter nodes based on filter query and quick filter
  const { filteredTree, matchingCount } = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    let count = 0;

    const matchesQuickFilter = (dest?: CulturalDestination, evt?: CulturalEvent): boolean => {
      if (quickFilter === "all") return true;
      if (quickFilter === "sulawesi") return dest?.province === "Sulawesi Selatan" || evt?.province === "Sulawesi Selatan";
      if (quickFilter === "lampung") return dest?.province === "Lampung" || evt?.province === "Lampung";
      if (quickFilter === "bahari") return dest?.category === "laut" || dest?.category === "pantai";
      if (quickFilter === "budaya") return dest?.category === "budaya" || dest?.category === "desa" || dest?.category === "pakaian";
      if (quickFilter === "pertanian") return dest?.category === "pertanian";
      if (quickFilter === "event") return Boolean(evt);
      return true;
    };

    const filterNode = (node: TreeNode): TreeNode | null => {
      if (node.destination) {
        const dest = node.destination;
        const matchesQuery =
          !q ||
          dest.name.toLowerCase().includes(q) ||
          dest.subtitle.toLowerCase().includes(q) ||
          dest.province.toLowerCase().includes(q) ||
          (dest.subCategory && dest.subCategory.toLowerCase().includes(q)) ||
          dest.category.toLowerCase().includes(q) ||
          dest.tags.some((t) => t.toLowerCase().includes(q));

        if (matchesQuery && matchesQuickFilter(dest, undefined)) {
          count++;
          return node;
        }
        return null;
      }

      if (node.event) {
        const evt = node.event;
        const matchesQuery =
          !q ||
          evt.name.toLowerCase().includes(q) ||
          evt.location.toLowerCase().includes(q) ||
          evt.province.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q);

        if (matchesQuery && matchesQuickFilter(undefined, evt)) {
          count++;
          return node;
        }
        return null;
      }

      if (node.children) {
        const filteredChildren = node.children
          .map(filterNode)
          .filter((c): c is TreeNode => c !== null);

        // If parent label matches directly or has matching children
        const parentMatchesQuery = !q || node.label.toLowerCase().includes(q);

        if (filteredChildren.length > 0 || (parentMatchesQuery && q.length > 0)) {
          return {
            ...node,
            children: filteredChildren,
            badge: filteredChildren.length,
          };
        }
      }

      return null;
    };

    const filtered = treeData.map(filterNode).filter((n): n is TreeNode => n !== null);
    return { filteredTree: filtered, matchingCount: count };
  }, [treeData, filterQuery, quickFilter]);

  // Automatically expand all nodes when user starts typing a query
  React.useEffect(() => {
    if (filterQuery.trim().length > 0) {
      setExpandedNodes(new Set(allNodeIds));
    }
  }, [filterQuery, allNodeIds]);

  // Recursive renderer for tree items
  const renderTree = (nodes: TreeNode[], depth: number = 0) => {
    return (
      <ul className={`space-y-1 ${depth > 0 ? "ml-3 sm:ml-4 pl-2 border-l border-amber-500/15" : ""}`}>
        {nodes.map((node) => {
          const isBranch = Boolean(node.children && node.children.length > 0);
          const isExpanded = expandedNodes.has(node.id);
          const isDest = Boolean(node.destination);
          const isEvt = Boolean(node.event);
          const isCurrentActive = activeDestination && node.destination?.id === activeDestination.id;
          const isInTrip = node.destination
            ? tripItems.some((t) => t.id === node.destination?.id)
            : false;

          const IconComponent = node.icon || (isBranch ? (isExpanded ? FolderOpen : Folder) : MapPin);

          if (isBranch) {
            return (
              <li key={node.id} className="select-none">
                <button
                  type="button"
                  onClick={() => toggleNode(node.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition group ${
                    depth === 0
                      ? "bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/20"
                      : "hover:bg-slate-800/60 text-slate-200 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-400 group-hover:text-amber-400 transition-transform">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        depth === 0 ? "text-amber-400" : "text-amber-400/70"
                      }`}
                    />
                    <span className="truncate">{node.label}</span>
                  </div>

                  {node.badge !== undefined && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        node.badgeColor || "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {node.badge}
                    </span>
                  )}
                </button>

                {isExpanded && node.children && (
                  <div className="mt-1 transition-all">{renderTree(node.children, depth + 1)}</div>
                )}
              </li>
            );
          }

          // Destination Leaf Node
          if (isDest && node.destination) {
            const dest = node.destination;
            return (
              <li key={node.id}>
                <div
                  className={`group relative flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                    isCurrentActive
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      : "bg-slate-900/50 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white"
                  }`}
                >
                  {/* Click row to select destination on map */}
                  <div
                    onClick={() => onSelectDestination(dest)}
                    className="flex-1 flex items-start gap-2.5 min-w-0 pr-2"
                  >
                    <div
                      className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        isCurrentActive
                          ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                          : "bg-slate-800 text-amber-400 border-slate-700 group-hover:border-amber-400/50"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate group-hover:text-amber-300">
                          {dest.name}
                        </span>
                        {dest.bmkgStation && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              dest.bmkgStation.safetyStatus === "AMAN"
                                ? "bg-emerald-400"
                                : dest.bmkgStation.safetyStatus === "WASPADA"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                            title={`Cuaca: ${dest.bmkgStation.condition} (${dest.bmkgStation.temperature}°C) - Status: ${dest.bmkgStation.safetyStatus}`}
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {dest.subtitle}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800/90 text-amber-400/90 font-mono">
                          {dest.province}
                        </span>
                        <span className="text-[9px] text-slate-500">•</span>
                        <span className="text-[9px] text-slate-400 uppercase">
                          {dest.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action: Add/Remove to Trip */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTripItem(dest);
                    }}
                    aria-label={isInTrip ? "Hapus dari rute trip" : "Tambah ke rute trip"}
                    title={isInTrip ? "Hapus dari Rencana Perjalanan" : "Tambah ke Rencana Perjalanan"}
                    className={`p-1.5 rounded-lg border transition active:scale-90 shrink-0 ${
                      isInTrip
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-slate-800/60 hover:bg-amber-500 hover:text-slate-950 border-slate-700 text-slate-400"
                    }`}
                  >
                    {isInTrip ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </li>
            );
          }

          // Cultural Event Leaf Node
          if (isEvt && node.event) {
            const evt = node.event;
            return (
              <li key={node.id}>
                <div
                  onClick={() => onFlyToCoords?.(evt.coordinates)}
                  className="group flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/40 text-left transition cursor-pointer"
                >
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 block truncate">
                      {evt.name}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{evt.location}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      {evt.dateRange}
                    </span>
                  </div>
                </div>
              </li>
            );
          }

          return null;
        })}
      </ul>
    );
  };

  return (
    <aside
      aria-label="Pohon Navigasi & Katalog Budaya"
      className={`fixed left-0 top-14 bottom-11 sm:bottom-12 z-25 w-80 sm:w-88 max-w-[90vw] bg-slate-950/95 backdrop-blur-2xl border-r border-amber-500/30 shadow-2xl flex flex-col text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
      }`}
    >
      {/* Top Header of Side Menu */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
              <span>Navigasi Pohon (Tree Menu)</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              Katalog Wilayah, Kategori & Destinasi
            </p>
          </div>
        </div>

        {/* Minimize / Close Side Menu button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Minimize Side Menu"
          title="Minimize Side Menu (Sembunyikan Panel)"
          className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-slate-400 transition"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* FILTER SECTION (Above Menu) - "di atas menu ada filter dan menu model tree menu" */}
      <div className="p-3 border-b border-white/10 bg-slate-900/40 space-y-2 shrink-0">
        {/* Search Input Filter */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari destinasi, adat, daerah..."
            className="w-full pl-8 pr-7 py-1.5 bg-slate-950/80 border border-slate-700 focus:border-amber-400 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition font-sans"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery("")}
              className="absolute right-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[10px]">
          {[
            { id: "all", label: "Semua" },
            { id: "sulawesi", label: "Sulawesi" },
            { id: "lampung", label: "Lampung" },
            { id: "bahari", label: "Bahari" },
            { id: "budaya", label: "Adat" },
            { id: "pertanian", label: "Pertanian" },
            { id: "event", label: "Event" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setQuickFilter(tab.id)}
              className={`px-2 py-0.5 rounded-lg font-semibold shrink-0 transition ${
                quickFilter === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tree Utility Bar: Expand All / Collapse All & Match Counter */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
          <span>
            {filterQuery.trim()
              ? `Ditemukan: ${matchingCount} entitas`
              : `${DESTINATIONS.length} Destinasi Terdata`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => expandAll(allNodeIds)}
              className="hover:text-amber-400 underline font-semibold transition"
            >
              Buka Semua
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-amber-400 underline font-semibold transition"
            >
              Tutup Semua
            </button>
          </div>
        </div>
      </div>

      {/* TREE MENU CONTENT (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {filteredTree.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <FolderTree className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs font-semibold text-slate-400">
              Tidak ada destinasi atau kategori yang cocok
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterQuery("");
                setQuickFilter("all");
              }}
              className="text-xs text-amber-400 hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          renderTree(filteredTree)
        )}
      </div>

      {/* Footer Info of Side Menu */}
      <div className="p-2.5 border-t border-white/10 bg-slate-900/70 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1 text-amber-300/80">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Klik item untuk fokus peta</span>
        </span>
        <span className="text-slate-500 font-mono">v1.2-tree</span>
      </div>
    </aside>
  );
}
