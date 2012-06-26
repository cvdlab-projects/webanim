# BioPlasm: Storyboard Manager & Movie Generator

## Introduction

This is the Storyboard Manager & Movie Generator for the BioPlasm platform. It lets you design your 3D animation by drawing a directed acylcic graph (called Storyboard) that represents the precedence relationships between the logical pieces of your animation (called Segments). By choosing a 3D model for each actor on your 3D scene, and defining a behaviour for each segment, you can then get your animation rendered and save it as a movie.

## Storyboard Manager

A Storyboard is a tool wich helps you when you're dealing with the coordination of a complex scene.

It is made by Events and Segments. A segment represents a piece of your animation played by an Actor and for wich you want to define precedence ralationships with respect to other segments. An Event is a state that your animation reaches when some segments have ended and after wich some other segments may start. A Storyboard can be represented by a directed acyclic graph, with a single vertex with no incoming edges (called Source) and a single vertex with no outgoing edges (called Sink). Vertices map events and edges map segments. By defining a weight for each edge, you can also map your segments' duration. The PERT algorithm computes a minimum and a maximum time to occur for each segment of the storyboard without delaying the completion of the animation over the minimum length. A start time between this 2 values could be then assigned to each outgoing segment.

With the BioPlasm Storyboard Manager you can draw your storyboard by clicking (for events) and dragging (for segments) on an html5 canvas.

You can also use the Storyboard Manager to add actors to your scene and define their behaviour within each of their segments.

By clicking on Process Storyboard, you can run the PERT algorithm on your storyboard and have a proper start time for all your segments.

The application will then turn to the Movie Generator mode.

## Movie Generator

TO DO
